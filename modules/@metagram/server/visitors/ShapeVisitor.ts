import { DiagramElementVisitor } from './DiagramElementVisitor';
import { Element } from '@metagram/framework';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { XMIDecoder } from '../decoding/XMIDecoder';
import { Shape } from '@metagram/framework';
import { Bounds } from '@metagram/framework';
import { ClassifierElement } from '@metagram/framework';
import { PackageElement } from '@metagram/framework';

export class ShapeVisitor extends DiagramElementVisitor {
  createInstance(node: ResolvedXMINode): Element {
    const modelElement = node.getElement('modelElement');
    if (!modelElement) throw new Error('Could not identify model element of compartmentable shape');
    switch (modelElement.typeName) {
      case 'Class':
      case 'PrimitiveType':
      case 'Enumeration':
        return new ClassifierElement();
      case 'Package': return new PackageElement();
      default: throw new Error(`Did not implement shape of ${modelElement.typeName}`);
    }
  }

  visitOwnedElement(decoder: XMIDecoder, name: string, childNode: ResolvedXMINode, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof Shape)) return;

    switch (name) {
      case 'bounds': {
        const bounds = decoder.decodeNode(childNode);
        if (bounds instanceof Bounds) {
          parent.bounds.x = bounds.x;
          parent.bounds.y = bounds.y;
          parent.bounds.width = bounds.width;
          parent.bounds.height = bounds.height;
        }
        return;
      }

      case 'modelElement': {
        const element = decoder.decodeNode(childNode);
        if (element) {
          parent.modelElement = element;
        }
        return;
      }

      default:
        super.visitOwnedElement(decoder, name, childNode, parent, parentNode);
    }
  }
}
