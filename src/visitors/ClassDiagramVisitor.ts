import { DiagramElementVisitor } from './DiagramElementVisitor';
import { Element } from '../models/Element';
import { ClassDiagram } from '../diagram/ClassDiagram';
import { XMIDecoder } from '../decoding/XMIDecoder';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { Diagram } from '../diagram/Diagram';

export class ClassDiagramVisitor extends DiagramElementVisitor {
  createInstance(node: ResolvedXMINode): Element {
    return new ClassDiagram();
  }

  visitOwnedElement(decoder: XMIDecoder, name: string, childNode: ResolvedXMINode, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof Diagram)) return;

    switch (name) {
      default:
        super.visitOwnedElement(decoder, name, childNode, parent, parentNode);
    }
  }

  visitAttr(decoder: XMIDecoder, name: string, value: string, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof Diagram)) return;
    switch (name) {
      case 'name':
        parent.name = value;
        return;

      case 'documentation':
        parent.documentation = value;
        return;

      case 'resolution':
        parent.resolution = parseFloat(value);
        return;

      default:
        super.visitAttr(decoder, name, value, parent, parentNode);
    }
  }
}