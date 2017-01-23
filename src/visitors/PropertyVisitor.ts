import { Type } from '../models/Type';
import { Visitor } from './Visitor';
import { Property } from '../models/Property';
import { Element } from '../models/Element';
import { URI as UML } from './UML20131001';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { XMIDecoder } from '../decoding/XMIDecoder';
import { Association } from '../models/Association';

export class PropertyVisitor extends Visitor {
  createInstance(): Property {
    return new Property();
  }

  visitAttr(decoder: XMIDecoder, name: string, value: string, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof Property)) return;

    switch (name) {
      case 'type': {
        const model = decoder.decodeNode(parentNode.getNodeByID(value));
        if (model instanceof Type) {
          parent.type = model;
        }
        return;
      }

      case 'association': {
        const model = decoder.decodeNode(parentNode.getNodeByID(value));
        if (model instanceof Association) {
          parent.association = model;
        }
        return;
      }

      default: super.visitAttr(decoder, name, value, parent, parentNode);
    }
  }

  visitOwnedElement(decoder: XMIDecoder, name: string, childNode: ResolvedXMINode, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof Property)) return;

    switch (name) {
      case 'type': {
        const model = decoder.decodeNode(childNode);
        if (model instanceof Type) {
          parent.type = model;
        } else {
          console.log('Model?' + model);
        }

        return;
      }

      case 'lowerValue': {
        parent.lowerValue = this.decodeLiteralNumber(childNode)!;
        return;
      }

      case 'upperValue': {
        parent.upperValue = this.decodeLiteralNumber(childNode)!;
        return;
      }

      case 'defaultValue': {
        switch (childNode.typeName) {
          case 'LiteralReal':
          case 'LiteralInteger':
          case 'LiteralUnlimitedNatural':
            parent.defaultValue = this.decodeLiteralNumber(childNode)!;
            return;
          case 'LiteralBoolean':
            parent.defaultValue = this.decodeLiteralBoolean(childNode)!;
            return;
          case 'LiteralString':
            parent.defaultValue = this.decodeLiteralString(childNode)!;
            return;
          case 'InstanceValue':
            const instance = childNode.getNodeByID(childNode.getString('instance')!);
            if (!instance) throw new Error(`Could not find InstanceValue.instance`);
            parent.defaultValue = decoder.decodeNode(instance);
            return;
        }

        console.error(`Unexpected default value type: ${childNode.typeName}`);
        return;
      }

      default:
        super.visitOwnedElement(decoder, name, childNode, parent, parentNode);
    }
  }
}
