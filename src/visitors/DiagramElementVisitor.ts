import { Visitor } from './Visitor';
import { Element } from '../models/Element';
import { XMIDecoder } from '../decoding/XMIDecoder';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { DiagramElement } from '../diagram/DiagramElement';

export class DiagramElementVisitor extends Visitor {
  visitOwnedElement(decoder: XMIDecoder, name: string, childNode: ResolvedXMINode, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof DiagramElement)) return;

    switch (name) {
      case 'ownedElement': {
        const child = decoder.decodeNode(childNode);
        if (child instanceof DiagramElement) {
          parent.ownedElements.add(child);
          child.owningElement = parent;
        }

        return;
      }

      default:
        super.visitOwnedElement(decoder, name, childNode, parent, parentNode);
    }
  }
}
