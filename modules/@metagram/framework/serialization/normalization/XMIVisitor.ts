import { Visitor } from './Visitor';
import { Element } from '../../models';
import { ResolvedXMINode } from '../encoding/ResolvedXMINode';
import { XMIDecoder } from '../encoding/XMIDecoder';
import { XMIImpl } from '../../models/xmi/XMIImpl';

export class XMIVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
    return new XMIImpl();
  }

  visitOwnedElement(decoder: XMIDecoder, name: string, childNode: ResolvedXMINode, parent: Element, parentNode: ResolvedXMINode): void {
    const child = decoder.decodeNode(childNode);
    if (child !== null) {
      parent.appendChild(child);
    }
  }
}
