import { XMI } from '../models/XMI';
import { Element as ModelElement } from '../models/Element';

export abstract class Visitor<T extends ModelElement> {
  constructor() {}

  abstract createInstance(): T;

  visitElement(element: Element, document: XMI, target: T, model?: ModelElement): void {
    const name = element.tagName;
    const pluralize = name + 's';

    if (model && name.includes(':')) {
      target.ownedElements.add(model);
      return;
    }

    if (model && target[pluralize] instanceof Set) {
      target[pluralize].add(model);
      return;
    }
  }

  visitAttr(name: string, value: string, target: T): void {
  }

  protected decodeLiteralNumber(element: Element): number | null {
    const [uri, type] = this.decodeXMIType(element);

    const value = element.getAttribute('value');
    if (type === 'LiteralReal') {
      return parseFloat(value!);
    }

    if (type !== 'LiteralInteger' && type !== 'LiteralUnlimitedNatural') {
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

  protected decodeLiteralBoolean(element: Element): boolean | null {
    const [uri, type] = this.decodeXMIType(element);
    if (type !== 'LiteralBoolean') {
      return null;
    }

    return element.getAttribute('value') === 'true';
  }

  protected decodeXMIType(element: Element): [string, string] {
    const type = element.getAttributeNS('http://www.omg.org/spec/XMI/20131001', 'type') || element.tagName;
    const [prefix, typeName] = type.split(':');
    return [element.lookupNamespaceURI(prefix)!, typeName];
  }
}
