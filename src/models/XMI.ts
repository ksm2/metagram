import { Element } from './Element';
import { Class } from '../decorators';

@Class('XMI', Element)
export class XMI extends Element {

  merge(otherXMI: XMI): XMI {
    otherXMI.ownedElements.forEach((ownedElement) => {
      ownedElement.owningElement = this;
      this.ownedElements.add(ownedElement);
      otherXMI.ownedElements.delete(ownedElement);
    });
    return this;
  }
}
