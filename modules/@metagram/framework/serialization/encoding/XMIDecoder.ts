import { Element, ModelElement, XMI } from '@metagram/models';
import { FetchService } from '../../services/FetchService';
import { Visitor } from '../normalization/Visitor';
import { XMIResolver } from './XMIResolver';
import { ResolvedXMINode } from './ResolvedXMINode';
import { XMINode } from './XMINode';

import UML25 from '../namespaces/UML25';
import XMI25 from '../namespaces/XMI25';
import UMLDI25 from '../namespaces/UMLDI25';
import DC11 from '../namespaces/DC11';
import DI11 from '../namespaces/DI11';

export class XMIDecoder {
  private visitors: Map<string, Map<string, Visitor>>;
  private unsupportedTypeURIs: Set<string> = new Set();
  private unsupportedTypeNames: Set<string> = new Set();
  private xmiResolver: XMIResolver;
  private resolvedMap: WeakMap<ResolvedXMINode, Element>;
  private promises: Promise<Element>[];

  constructor(private fetchService: FetchService) {
    this.xmiResolver = new XMIResolver(fetchService);
    this.visitors = new Map();
    this.resolvedMap = new WeakMap();
    this.promises = [];
    this.registerModel(UML25);
    this.registerModel(XMI25);
    this.registerModel(UMLDI25);
    this.registerModel(DC11);
    this.registerModel(DI11);
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

  async loadNodeByType(typeURI: string, typeName: string): Promise<ModelElement> {
    const tree = await this.xmiResolver.resolveURI(typeURI);
    const element = this.decodeNode(tree.getChildNodeByName(typeName));
    if (!(element instanceof ModelElement)) throw new Error(`Could not resolve: ${typeName} from ${typeURI}`);

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
