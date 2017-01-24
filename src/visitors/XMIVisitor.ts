import { Visitor } from './Visitor';
import { Element } from '../models/Element';
import { XMI } from '../models/XMI';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { XMIDecoder } from '../decoding/XMIDecoder';
import { ModelElement } from '../models/ModelElement';

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
