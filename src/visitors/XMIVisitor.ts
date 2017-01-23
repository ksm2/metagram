import { Visitor } from './Visitor';
import { Element } from '../models/Element';
import { XMI } from '../models/XMI';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { XMIDecoder } from '../decoding/XMIDecoder';

export class XMIVisitor extends Visitor {
  createInstance(): XMI {
    return new XMI();
  }

  visitOwnedElement(decoder: XMIDecoder, name: string, childNode: ResolvedXMINode, parent: Element, parentNode: ResolvedXMINode): void {
    const child = decoder.decodeNode(childNode);
    if (child) {
      parent.ownedElements.add(child);
      child.owningElement = parent;
    }
  }
}
