import { Diagram } from '../../diagram/Diagram';
import { Element, ModelElement } from '../../models';
import { ResolvedXMINode } from '../encoding/ResolvedXMINode';
import { XMIDecoder } from '../encoding/XMIDecoder';

export class Visitor {
  constructor() {}

  createInstance(node: ResolvedXMINode): Element {
    return new Element();
  }

  visit(decoder: XMIDecoder, node: ResolvedXMINode, element: Element): Error[] {
    element.setID(node.id);
    element.setOrigin(node.origin);
    element.setTypeURI(node.typeURI);
    element.setTypeName(node.typeName);

    const errors: Error[] = [];

    for (const [name, values] of node.attrs) {
      for (const value of values) {
        try {
          this.visitAttr(decoder, name, value, element, node);
        } catch (e) {
          errors.push(e);
        }
      }
    }

    for (const [name, childNodes] of node.elements) {
      for (const childNode of childNodes) {
        try {
          this.visitOwnedElement(decoder, name, childNode, element, node);
        } catch (e) {
          errors.push(e);
        }
      }
    }

    return errors;
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
   * Parses a boolean out of a string
   */
  protected valueToBoolean(value: string, property: string): boolean {
    if (value === 'true') return true;
    if (value === 'false') return false;

    throw new Error(`Wrong value for "${property}": ${value}`);
  }

  /**
   * Decodes UML's literal boolean type
   */
  protected decodeLiteralBoolean(element: ResolvedXMINode): boolean | null {
    if (element.typeName === 'LiteralBoolean' && element.has('value')) {
      return this.valueToBoolean(element.getString('value')!, element.tagName);
    }

    return null;
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
