import { Element } from '@metagram/models';
import { DiagramElement } from '../../diagram/DiagramElement';
import { Visitor } from './Visitor';
import { XMIDecoder } from '../encoding/XMIDecoder';
import { ResolvedXMINode } from '../encoding/ResolvedXMINode';

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