import { Element } from './Element';
import { Class, Attribute } from '../decorators';

@Class('XMI', Element)
export class XMI extends Element {
  private _ownedElements = new Set<Element>();

  @Attribute({ type: Element, lower: 0, upper: Infinity })
  get ownedElements(): Set<Element> {
    return this._ownedElements;
  }

  set ownedElements(value: Set<Element>) {
    this._ownedElements = value;
  }

  /**
   * Merges the XMI file with another
   *
   * @param otherXMI The xmi file to merge
   */
  merge(otherXMI: XMI): XMI {
    otherXMI.ownedElements.forEach((ownedElement) => {
      this.ownedElements.add(ownedElement);
      otherXMI.ownedElements.delete(ownedElement);
    });
    return this;
  }
}
