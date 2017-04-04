import { Element } from '../../models';
import { ModelElement } from '../../models';
import { Package } from '../../models';
import { ResolvedXMINode } from '../encoding/ResolvedXMINode';
import { XMIDecoder } from '../encoding/XMIDecoder';
import { Visitor } from './Visitor';

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
          parent.packagedElement.add(child);
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
