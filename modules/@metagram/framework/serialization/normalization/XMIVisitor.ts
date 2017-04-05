import { Element, XMI } from '../../models';
import { ResolvedXMINode, XMIDecoder } from '../encoding';
import { Visitor } from './Visitor';

export class XMIVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
    return new XMI();
  }

  visitOwnedElement(decoder: XMIDecoder, name: string, childNode: ResolvedXMINode, parent: Element, parentNode: ResolvedXMINode): void {
    const child = decoder.decodeNode(childNode);
    if (child !== null) {
      parent.appendChild(child);
    }
  }
}
