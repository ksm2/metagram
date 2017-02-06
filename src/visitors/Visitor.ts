import { Element } from '../models/Element';
import { XMIDecoder } from '../decoding/XMIDecoder';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { ModelElement } from '../models/uml/ModelElement';
import { Diagram } from '../diagram/Diagram';

export class Visitor {
  constructor() {}

  createInstance(node: ResolvedXMINode): Element {
    return new Element();
  }

  visit(decoder: XMIDecoder, node: ResolvedXMINode, element: Element): Element {
    element.setID(node.id);
    element.setOrigin(node.origin);
    decoder.loadNodeByType(node.typeURI, node.typeName).then((uriNode) => {
      element.setInstanceOf(uriNode);
    });

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
    if (!(parent instanceof ModelElement)) return;

    switch (name) {
      case 'ownedElement': {
        const child = decoder.decodeNode(childNode);
        if (child instanceof ModelElement) {
          parent.ownedElements.add(child);
          child.owningElement = parent;
        }

        return;
      }

      case 'ownedComment': {
        parent.comments = new Set(childNode.attrs.get('body'));
        return;
      }

      case 'di:Diagram':
      case 'umldi:Diagram': {
        const diagram = decoder.decodeNode(childNode);
        if (diagram instanceof Diagram) {
          parent.appendChild(diagram);
        }
        return;
      }
    }
  }

  visitAttr(decoder: XMIDecoder, name: string, value: string, parent: Element, parentNode: ResolvedXMINode): void {
    if (parent instanceof ModelElement) {
      if (name === 'name') parent.name = value;
    }
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
