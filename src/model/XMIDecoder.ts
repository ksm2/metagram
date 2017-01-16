import path = require('path');
import fetch from 'node-fetch';
import { FileService } from './FileService';
import { XMI } from './models/XMI';
import { DOMParser } from 'xmldom';
import { Element as ModelElement } from './models/Element';
import { Visitor } from './visitors';
import UML20131001 from './visitors/UML20131001';
import XMI20131001 from './visitors/XMI20131001';

const XMI_URI = 'http://www.omg.org/spec/XMI/20131001';

export class XMIDecoder {
  private parser: DOMParser;
  private urlToXMIPromiseMap: Map<string, Promise<XMI>>;
  private visitors: Map<string, Map<string, Visitor<any>>>;

  constructor(private fileService: FileService, private cacheDir: string) {
    this.parser = new DOMParser();
    this.urlToXMIPromiseMap = new Map();
    this.visitors = new Map();
    this.registerModel(UML20131001);
    this.registerModel(XMI20131001);
  }

  registerModel({ URI, visitors }: { URI: string, visitors: { [key: string]: Visitor<any> } }) {
    this.visitors.set(URI, new Map(Object.keys(visitors).map((typeName) => {
      return [typeName, visitors[typeName]] as [string, Visitor<any>];
    })));
  }

  /**
   * Loads a model from an URL
   *
   * @param url URL where the file to decode can be found
   * @param [encoding] Encoding of that file
   * @returns Promise for a model element
   */
  async loadURL(url: string, encoding: string = 'utf8'): Promise<XMI> {
    let promisedXMI = this.urlToXMIPromiseMap.get(url);
    if (!promisedXMI) {
      promisedXMI = this.decodeURL(url, encoding);
      this.urlToXMIPromiseMap.set(url, promisedXMI);
    }

    return promisedXMI;
  }

  /**
   * Asynchronously gets an element by an hyper reference
   *
   * @param href The hyper reference to look for
   * @returns a promised found element or null, if no element found
   */
  async getElementByHref(href: string): Promise<ModelElement | null> {
    const [url, id] = href.split('#');
    const xmi = await this.loadURL(url);
    return xmi.getElementByID(id);
  }

  /**
   * Decodes the given XMI behind an URL
   */
  private async decodeURL(url: string, encoding: string = 'utf8'): Promise<XMI> {
    console.info(`Resolving ${url}`);
    const filename = path.join(this.cacheDir, url.replace(/[^\w.]/g, '-'));

    const exists = await this.fileService.fileExists(filename);
    if (!exists) {
      console.info(`Downloading ${url}`);
      const res = await fetch(url);
      const text = await res.text();
      console.info(`Caching ${url}`);
      await this.fileService.writeFile(text, filename, encoding);
    } else {
      console.info(`Using cached ${url}`);
    }

    return this.decodeFile(filename, encoding);
  }

  /**
   * Loads a model from file The document's origin
   *
   * @param filename Name of the file to decode
   * @param [encoding] Encoding of that file
   * @returns Promise for a model element
   */
  private async decodeFile(filename: string, encoding: string = 'utf8'): Promise<XMI> {
    const data = await this.fileService.readFile(filename, encoding);
    const xmlDoc = this.parser.parseFromString(data, 'text/xml');
    const xmiElements = xmlDoc.getElementsByTagNameNS(XMI_URI, 'XMI');
    if (xmiElements.length !== 1) throw `Unexpected amount of XMI elements: ${xmiElements.length} (expected 1)`;

    // Denormalize XMI elements
    const element = xmiElements.item(0);
    const tree = new WeakMap<Element, ModelElement>();

    const xmi = await this.createTree(element, tree);
    if (!xmi) throw 'Could not create XMI tree';

    this.denormalizeTree(element, tree);

    return xmi as XMI;
  }

  /**
   * Creates an XMI tree from an XML structure
   */
  private async createTree(xml: Element, tree: WeakMap<Element, ModelElement>, root?: ModelElement): Promise<ModelElement | null> {
    const { id, idref, name, href } = this.extractXMIInfo(xml);

    // Check for idref
    if (idref) {
      if (!root) throw 'XMI document broken: Used xmi:idref before specifying root';
      return root.getElementByID(idref);
    }

    // Check for href
    if (href) {
      return await this.getElementByHref(href);
    }

    // Check if can retrieve visitor
    const visitor = this.getVisitor(xml);
    if (!visitor) return null;

    const xmiElement = visitor.createInstance();
    tree.set(xml, xmiElement);
    xmiElement.ID = id;
    xmiElement.name = name;

    const promisedChildren = Array.from(xml.childNodes)
      // Is child node an element?
      .filter(childNode => childNode.nodeType === 1)
      // Map XML element to XMI
      .map(child => this.createTree(child as Element, tree, root || xmiElement))
    ;

    // Add children
    const children = await Promise.all(promisedChildren);
    children.forEach(xmi => xmi && xmiElement.appendChild(xmi));

    return xmiElement;
  }

  private denormalizeTree<T extends ModelElement>(root: Element, weakMap: WeakMap<Element, ModelElement>): void {
    const xmi: XMI = weakMap.get(root)!;
    const queue = [root];
    while (queue.length) {
      const element = queue.shift()!;

      const target = weakMap.get(element)!;
      const visitor = this.getVisitor(root)!;

      // Visit attributes
      Array.from(element.attributes).forEach(attr => visitor.visitAttr(attr.name, attr.value, target));

      for (let child of Array.from(element.childNodes) as Element[]) {
        if (child.nodeType !== 1) continue;

        // Push child to weak map
        if (weakMap.has(child)) queue.push(child);

        // Parse comments
        if (child.tagName === 'ownedComment') {
          target.comment = '';
          const bodies = child.getElementsByTagName('body');
          for (let i = 0; i < bodies.length; i += 1) {
            target.comment += bodies[i].textContent;
          }

          continue;
        }

        visitor.visitElement(child, xmi, target, weakMap.get(child));
      }
    }
  }

  /**
   * Extracts XMI information from an XML element
   */
  private extractXMIInfo(element: Element): { id?: string; idref?: string; type?: string; name?: string; href?: string } {
    return {
      id: element.getAttributeNS(XMI_URI, 'id'),
      idref: element.getAttributeNS(XMI_URI, 'idref'),
      name: element.getAttribute('name') || '',
      href: element.getAttribute('href') || '',
    };
  }

  private getVisitor(xml: Element): Visitor<any> | null {
    const elementType = xml.getAttributeNS(XMI_URI, 'type') || xml.tagName;

    const [prefix, typeName] = elementType.split(':');
    const uri = xml.lookupNamespaceURI(prefix);

    if (!uri) throw `XMI document broken: does not specify prefix ${prefix}`;

    // Check if type is supported
    if (!this.visitors.has(uri) || !this.visitors.get(uri)!.has(typeName)) {
      console.error(`Unsupported type ${typeName} from ${uri}`);
      return null;
    }

    return this.visitors.get(uri)!.get(typeName)!;
  }
}
