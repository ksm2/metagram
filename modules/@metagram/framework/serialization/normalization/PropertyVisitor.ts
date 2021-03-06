import { Element } from '../../models';
import { Type } from '../../models';
import { Property } from '../../models';
import { Association } from '../../models';
import { EnumerationLiteral } from '../../models';
import { AggregationKind } from '../../models';
import { ResolvedXMINode } from '../encoding/ResolvedXMINode';
import { XMIDecoder } from '../encoding/XMIDecoder';
import { Visitor } from './Visitor';

export class PropertyVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
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

      case 'aggregation': {
        parent.aggregation = value;
        return;
      }

      case 'isOrdered': {
        parent.ordered = this.valueToBoolean(value, 'isOrdered');
        return;
      }

      case 'isUnique': {
        parent.unique = this.valueToBoolean(value, 'isUnique');
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

            const defaultValue = decoder.decodeNode(instance);
            if (defaultValue instanceof EnumerationLiteral) {
              parent.defaultValue = defaultValue;
            }
            return;
        }

        throw new Error(`Unexpected default value type: ${childNode.typeName}`);
      }

      default:
        super.visitOwnedElement(decoder, name, childNode, parent, parentNode);
    }
  }
}
