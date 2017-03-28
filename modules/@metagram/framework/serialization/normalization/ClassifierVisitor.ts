import { Element } from '../../models';
import { Property } from '../../models';
import { Classifier } from '../../models';
import { Operation } from '../../models';
import { Visitor } from './Visitor';
import { ResolvedXMINode } from '../encoding/ResolvedXMINode';
import { XMIDecoder } from '../encoding/XMIDecoder';

export class ClassifierVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
    return new Classifier();
  }

  visitOwnedElement(decoder: XMIDecoder, name: string, childNode: ResolvedXMINode, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof Classifier)) return;

    switch (name) {
      case 'ownedAttribute': {
        const child = decoder.decodeNode(childNode);
        if (child instanceof Property) {
          parent.ownedAttributes.add(child);
          parent.ownedElements.add(child);
          child.owningElement = parent;
        }
        return;
      }

      case 'ownedOperation': {
        const child = decoder.decodeNode(childNode);
        if (child instanceof Operation) {
          parent.ownedOperations.add(child);
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
