import { ClassifierVisitor } from './ClassifierVisitor';
import { Element } from '../models/Element';
import { Association } from '../models/Association';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { XMIDecoder } from '../decoding/XMIDecoder';
import { Property } from '../models/Property';

export class AssociationVisitor extends ClassifierVisitor {
  createInstance(node: ResolvedXMINode): Element {
    return new Association();
  }

  visitAttr(decoder: XMIDecoder, name: string, value: string, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof Association)) return;

    switch (name) {
      case 'memberEnd': {
        parent.memberEnd = value.split(' ')
          .map(id => parentNode.getNodeByID(id))
          .map(node => decoder.decodeNode(node))
          .filter(it => it instanceof Property) as Property[];
      }

      default:
        super.visitAttr(decoder, name, value, parent, parentNode);
    }
  }
}
