import { Visitor } from './Visitor';
import { Element } from '../models/Element';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { XMIDecoder } from '../decoding/XMIDecoder';
import { Type } from '../models/uml/Type';
import { Parameter } from '../models/uml/Parameter';
import { ParameterDirectionKind } from '../models/uml/ParameterDirectionKind';
import { EnumerationLiteral } from '../models/uml/EnumerationLiteral';

export class ParameterVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
    return new Parameter();
  }

  visitOwnedElement(decoder: XMIDecoder, name: string, childNode: ResolvedXMINode, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof Parameter)) return;
    switch (name) {
      case 'type': {
        const model = decoder.decodeNode(childNode);
        if (model instanceof Type) {
          parent.type = model;
        }

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

        console.error(`Unexpected default value type: ${childNode.typeName}`);
        return;
      }

      default:
        super.visitOwnedElement(decoder, name, childNode, parent, parentNode);
    }
  }

  visitAttr(decoder: XMIDecoder, name: string, value: string, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof Parameter)) return;

    switch (name) {
      case 'type': {
        const model = decoder.decodeNode(parentNode.getNodeByID(value));
        if (model instanceof Type) {
          parent.type = model;
        }
        return;
      }

      case 'direction': {
        parent.direction = value;
        return;
      }

      default: super.visitAttr(decoder, name, value, parent, parentNode);
    }
  }
}
