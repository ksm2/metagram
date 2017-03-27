import { Element } from '@metagram/models';
import { Operation } from '@metagram/models';
import { Parameter } from '@metagram/models';
import { Visitor } from './Visitor';
import { ResolvedXMINode } from '../encoding/ResolvedXMINode';
import { XMIDecoder } from '../encoding/XMIDecoder';

export class OperationVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
    return new Operation();
  }

  visitOwnedElement(decoder: XMIDecoder, name: string, childNode: ResolvedXMINode, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof Operation)) return;

    switch (name) {
      case 'ownedParameter': {
        const child = decoder.decodeNode(childNode);
        if (child instanceof Parameter) {
          parent.ownedParameters.add(child);
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
