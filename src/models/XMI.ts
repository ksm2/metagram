import { ModelElement } from './ModelElement';
import { Class, Attribute } from '../decorators';

@Class('XMI', ModelElement)
export class XMI extends ModelElement {
  merge(otherXMI: XMI): XMI {
    otherXMI.ownedElements.forEach((ownedElement) => {
      ownedElement.owningElement = this;
      this.ownedElements.add(ownedElement);
      otherXMI.ownedElements.delete(ownedElement);
    });
    return this;
  }
}
