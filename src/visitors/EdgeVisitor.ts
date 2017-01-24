import { DiagramElementVisitor } from './DiagramElementVisitor';
import { Element } from '../models/Element';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { XMIDecoder } from '../decoding/XMIDecoder';
import { Edge } from '../diagram/Edge';
import { Shape } from '../diagram/Shape';
import { PackageImportElement } from '../diagram/PackageImportElement';
import { GeneralizationElement } from '../diagram/GeneralizationElement';
import { AssociationElement } from '../diagram/AssociationElement';
import { Point } from '../diagram/Point';

export class EdgeVisitor extends DiagramElementVisitor {
  createInstance(node: ResolvedXMINode): Element {
    const modelElement = node.getElement('modelElement');
    if (!modelElement) throw new Error('Could not identify model element of compartmentable shape');
    switch (modelElement.typeName) {
      case 'PackageImport':
        return new PackageImportElement();
      case 'Generalization':
        return new GeneralizationElement();
      case 'Association':
        return new AssociationElement();
      default: throw new Error(`Did not implement shape of ${modelElement.typeName}`);
    }
  }

  visitOwnedElement(decoder: XMIDecoder, name: string, childNode: ResolvedXMINode, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof Edge)) return;

    switch (name) {
      case 'modelElement': {
        const element = decoder.decodeNode(childNode);
        if (element) {
          parent.modelElement = element;
        }
        return;
      }

      case 'waypoint': {
        const point = decoder.decodeNode(childNode);
        if (point instanceof Point) {
          parent.waypoint.push(point);
        }
        return;
      }

      default:
        super.visitOwnedElement(decoder, name, childNode, parent, parentNode);
    }
  }

  visitAttr(decoder: XMIDecoder, name: string, value: string, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof Edge)) return;

    switch (name) {
      case 'source': {
        const element = decoder.decodeNode(parentNode.getNodeByID(value));
        if (element instanceof Shape) {
          parent.source = element;
        }
        return;
      }

      case 'target': {
        const element = decoder.decodeNode(parentNode.getNodeByID(value));
        if (element instanceof Shape) {
          parent.target = element;
        }
        return;
      }

      default:
        super.visitAttr(decoder, name, value, parent, parentNode);
    }
  }
}
