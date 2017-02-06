import { Visitor } from './Visitor';
import { Element } from '../models/Element';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { XMIDecoder } from '../decoding/XMIDecoder';
import { Operation } from '../models/uml/Operation';
import { Parameter } from '../models/uml/Parameter';

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
