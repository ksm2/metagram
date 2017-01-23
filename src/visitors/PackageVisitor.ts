import { Visitor } from './Visitor';
import { Package } from '../models/Package';
import { Element } from '../models/Element';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { XMIDecoder } from '../decoding/XMIDecoder';
import { ModelElement } from '../models/ModelElement';
import { Diagram } from '../diagram/Diagram';
import { XMI } from '../models/XMI';

export class PackageVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
    return new Package();
  }

  visitAttr(decoder: XMIDecoder, name: string, value: string, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof Package)) return;

    switch (name) {
      case 'URI': {
        parent.URI = value;
        return;
      }

      default: return super.visitAttr(decoder, name, value, parent, parentNode);
    }
  }

  visitOwnedElement(decoder: XMIDecoder, name: string, childNode: ResolvedXMINode, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof Package)) return;

    switch (name) {
      case 'packagedElement': {
        const child = decoder.decodeNode(childNode);
        if (child instanceof ModelElement) {
          parent.packagedElements.add(child);
          parent.ownedElements.add(child);
          child.owningElement = parent;
        }
        return;
      }

      case 'umldi:Diagram': {
        const diagram = decoder.decodeNode(childNode);
        if (diagram instanceof Diagram) {
          parent.diagrams.add(diagram);
        }
        return;
      }

      default:
        super.visitOwnedElement(decoder, name, childNode, parent, parentNode);
    }
  }
}
