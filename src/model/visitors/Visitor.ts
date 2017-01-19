import { Element } from '../models/Element';
import { XMIDecoder } from '../decoding/XMIDecoder';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';

export abstract class Visitor {
  constructor() {}

  createInstance(): Element {
    return new Element();
  }

  visit(decoder: XMIDecoder, node: ResolvedXMINode, element: Element): Element {
    element.setID(node.id);
    element.setOrigin(node.origin);
    element.setTypeURI(node.typeURI);
    element.setTypeName(node.typeName);

    for (let [name, values] of node.attrs) {
      for (let value of values) {
        this.visitAttr(decoder, name, value, element, node);
      }
    }

    for (let [name, childNodes] of node.elements) {
      for (let childNode of childNodes) {
        this.visitOwnedElement(decoder, name, childNode, element, node);
      }
    }

    return element;
  }

  visitOwnedElement(decoder: XMIDecoder, name: string, childNode: ResolvedXMINode, parent: Element, parentNode: ResolvedXMINode): void {
    if (name === 'ownedComment') {
      parent.comments = new Set(childNode.attrs.get('body'));
    }
  }

  visitAttr(decoder: XMIDecoder, name: string, value: string, parent: Element, parentNode: ResolvedXMINode): void {
    if (name === 'name') parent.name = value;
  }

  /**
   * Decodes UML's literal number types
   */
  protected decodeLiteralNumber(element: ResolvedXMINode): number | null {
    const value = element.getString('value');
    if (element.typeName  === 'LiteralReal') {
      return parseFloat(value!);
    }

    if (element.typeName !== 'LiteralInteger' && element.typeName !== 'LiteralUnlimitedNatural') {
      return null;
    }

    if (value === null || !value.length) {
      return 0;
    }

    if (value === '*') {
      return Infinity;
    }

    return parseInt(value, 10);
  }

  /**
   * Decodes UML's literal boolean type
   */
  protected decodeLiteralBoolean(element: ResolvedXMINode): boolean | null {
    return element.typeName === 'LiteralBoolean' ? element.getString('value') === 'true' : null;
  }

  /**
   * Decodes UML's literal string type
   */
  protected decodeLiteralString(element: ResolvedXMINode): string | null {
    return element.typeName === 'LiteralString' ? element.getString('value') : null;
  }

  protected decodeXMIType(element: ResolvedXMINode): [string, string] {
    return [element.typeURI, element.typeName];
  }
}