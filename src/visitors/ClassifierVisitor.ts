import { Visitor } from './Visitor';
import { Element } from '../models/Element';
import { Property } from '../models/Property';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { XMIDecoder } from '../decoding/XMIDecoder';
import { Classifier } from '../models/Classifier';
import { Operation } from '../models/Operation';

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
