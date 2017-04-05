import { DiagramElement } from '../../diagram/DiagramElement';
import { Element } from '../../models';
import { ResolvedXMINode } from '../encoding/ResolvedXMINode';
import { XMIDecoder } from '../encoding/XMIDecoder';
import { Visitor } from './Visitor';

export class DiagramElementVisitor extends Visitor {
  visitOwnedElement(decoder: XMIDecoder, name: string, childNode: ResolvedXMINode, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof DiagramElement)) return;

    switch (name) {
      case 'ownedElement': {
        const child = decoder.decodeNode(childNode);
        if (child instanceof DiagramElement) {
          parent.ownedElements.push(child);
          child.owningElement = parent;
        }

        return;
      }

      default:
        super.visitOwnedElement(decoder, name, childNode, parent, parentNode);
    }
  }
}
