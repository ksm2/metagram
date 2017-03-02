import { Element } from '@metagram/framework';
import { Enumeration } from '@metagram/framework';
import { EnumerationLiteral } from '@metagram/framework';
import { Visitor } from './Visitor';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { XMIDecoder } from '../decoding/XMIDecoder';

export class EnumerationVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
    return new Enumeration();
  }

  visitOwnedElement(decoder: XMIDecoder, name: string, childNode: ResolvedXMINode, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof Enumeration)) return;

    switch (name) {
      case 'ownedLiteral': {
        const child = decoder.decodeNode(childNode);
        if (child instanceof EnumerationLiteral) {
          parent.ownedLiterals.add(child);
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
