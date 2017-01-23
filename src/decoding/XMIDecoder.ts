import { FileService } from '../FileService';
import { XMI } from '../models/XMI';
import { Element } from '../models/Element';
import { Visitor } from '../visitors';
import { XMIResolver } from './XMIResolver';
import { ResolvedXMINode } from './ResolvedXMINode';
import { XMINode } from './XMINode';

import UML20131001 from '../namespaces/UML20131001';
import XMI20131001 from '../namespaces/XMI20131001';
import UMLDI20131001 from '../namespaces/UMLDI20131001';
import DC20131001 from '../namespaces/DC20131001';

export class XMIDecoder {
  private visitors: Map<string, Map<string, Visitor>>;
  private unsupportedTypeURIs: Set<string> = new Set();
  private unsupportedTypeNames: Set<string> = new Set();
  private xmiResolver: XMIResolver;
  private resolvedMap: WeakMap<ResolvedXMINode, Element>;
  private promises: Promise<Element>[];

  constructor(private fileService: FileService, private cacheDir: string) {
    this.xmiResolver = new XMIResolver(fileService, cacheDir);
    this.visitors = new Map();
    this.resolvedMap = new WeakMap();
    this.promises = [];
    this.registerModel(UML20131001);
    this.registerModel(XMI20131001);
    this.registerModel(UMLDI20131001);
    this.registerModel(DC20131001);
  }

  registerModel({ URI, visitors }: { URI: string, visitors: { [key: string]: Visitor } }) {
    this.visitors.set(URI, new Map(Object.keys(visitors).map((typeName) => {
      return [typeName, visitors[typeName]] as [string, Visitor];
    })));
  }

  /**
   * Load multiple URLs
   */
  async loadURLs(...urls: string[]): Promise<XMI | null> {
    let p: Promise<XMI | null> = Promise.resolve(null);
    while (urls.length) {
      const url = urls.shift()!;
      p = p.then((xmi) => {
        return this.loadURL(url).then((otherXmi) => {
          if (xmi) {
            return xmi.merge(otherXmi)
          }

          return otherXmi;
        });
      });
    }

    return p;
  }

  /**
   * Loads a model from an URL
   *
   * @param url URL where the file to decode can be found
   * @param [encoding] Encoding of that file
   * @returns Promise for a model element
   */
  async loadURL(url: string, encoding: string = 'utf8'): Promise<XMI> {
    const tree = await this.xmiResolver.resolveTree(url, encoding);
    const element = this.decodeNode(tree);
    if (!(element instanceof XMI)) throw new Error(`Tree root has wrong type: ${element}`);

    return element;
  }

  /**
   * Print errors which occurred during decoding
   */
  printErrors(): void {
    if (this.unsupportedTypeURIs.size) {
      console.error(`Unsupported URIs during decoding:\n${[...this.unsupportedTypeURIs].reduce((x, uri) => `${x}  - ${uri}\n`, '')}`);
    }
    if (this.unsupportedTypeNames.size) {
      console.warn(`Unsupported XMI types during decoding:\n${[...this.unsupportedTypeNames].reduce((x, type) => `${x}  - ${type}\n`, '')}`);
    }
  }

  /**
   * Returns all resolved elements
   */
  getResolvedElements(): Promise<Element[]> {
    return Promise.all(this.promises);
  }

  /**
   * Recursively denormalizes XMI tree nodes
   */
  decodeNode(node: XMINode | null): Element | null {
    // Prevent wrong arguments
    if (!(node instanceof ResolvedXMINode)) return null;

    // Prevent cyclic references
    if (this.resolvedMap.has(node)) return this.resolvedMap.get(node)!;

    const visitor = this.getVisitor(node.typeURI, node.typeName);
    if (!visitor) return null;

    // Instantiate XMI element
    const target = visitor.createInstance(node);
    this.resolvedMap.set(node, target);
    this.promises.push(new Promise((resolve) => {
      visitor.visit(this, node, target);
      resolve(target);
    }));

    return target;
  }

  private getVisitor(typeURI: string, typeName: string): Visitor | null {
    // Check if URI is supported
    if (!this.visitors.has(typeURI)) {
      this.unsupportedTypeURIs.add(typeURI);
      return null;
    }

    // Check if type is supported
    if (!this.visitors.get(typeURI)!.has(typeName)) {
      this.unsupportedTypeNames.add(`${typeName} from ${typeURI}`);
      return null;
    }

    return this.visitors.get(typeURI)!.get(typeName)!;
  }
}
