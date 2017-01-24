import { Element } from './Element';
import { Class, Attribute } from '../decorators';

@Class('XMI', Element)
export class XMI extends Element {
  /**
   * Merges the XMI file with another
   *
   * @param otherXMI The xmi file to merge
   */
  merge(otherXMI: XMI): XMI {
    otherXMI.contents.forEach((ownedElement) => {
      this.appendChild(ownedElement);
      otherXMI.removeChild(ownedElement);
    });
    return this;
  }
}
