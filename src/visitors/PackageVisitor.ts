import { Visitor } from './Visitor';
import { Package } from '../models/Package';
import { Element } from '../models/Element';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { XMIDecoder } from '../decoding/XMIDecoder';

export class PackageVisitor extends Visitor {
  createInstance(): Package {
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
        if (child) {
          parent.packagedElements.add(child);
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
