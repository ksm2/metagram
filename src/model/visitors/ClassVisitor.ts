import { ClassifierVisitor } from './ClassifierVisitor';
import { Class } from '../models/Class';
import { Element } from '../models/Element';
import { XMIDecoder } from '../decoding/XMIDecoder';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';

export class ClassVisitor extends ClassifierVisitor {
  createInstance(): Element {
    return new Class();
  }

  visitOwnedElement(decoder: XMIDecoder, name: string, childNode: ResolvedXMINode, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof Class)) return;

    switch (name) {
      case 'generalization': {
        let general: any = childNode.get('general')![0];

        if (typeof general === 'string') {
          general = childNode.getNodeByID(general);
        }

        if (general instanceof ResolvedXMINode) {
          const generalClass = decoder.decodeNode(general);
          if (generalClass instanceof Class) {
            parent.generalizations.add(generalClass);
            generalClass.specializations.add(parent);
          }
        } else {
          console.error(`Could not find generalization: ${general}`);
        }

        return;
      }

      default:
        super.visitOwnedElement(decoder, name, childNode, parent, parentNode);
    }
  }
}