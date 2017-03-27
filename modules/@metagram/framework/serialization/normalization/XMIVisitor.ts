import { Visitor } from './Visitor';
import { Element, ModelElement, XMI } from '@metagram/models';
import { ResolvedXMINode } from '../encoding/ResolvedXMINode';
import { XMIDecoder } from '../encoding/XMIDecoder';

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
