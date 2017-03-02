import { Visitor } from './Visitor';
import { Element, ModelElement, XMI } from '@metagram/framework';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { XMIDecoder } from '../decoding/XMIDecoder';

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
