import { Type } from '../models/Type';
import { Visitor } from './Visitor';
import { Property } from '../models/Property';
import { XMI } from '../models/XMI';
import { EnumerationLiteral } from '../models/EnumerationLiteral';
import { Element as ModelElement } from '../models/Element';
import { URI as UML } from './UML20131001';

export class PropertyVisitor extends Visitor<Property> {
  createInstance(): Property {
    return new Property();
  }

  visitAttr(name: string, value: string, document: XMI, target: Property): void {
    switch (name) {
      case 'type': {
        const model = document.getElementByID(value);
        if (model instanceof Type) {
          target.type = model;
        }
        return;
      }

      default: super.visitAttr(name, value, document, target);
    }
  }

  visitElement(element: Element, document: XMI, target: Property, model: ModelElement): void {
    switch (element.tagName) {
      case 'type': {
        if (model && model instanceof Type) {
          target.type = model;
        } else {
          console.log(model);
        }

        return;
      }

      case 'lowerValue': {
        target.lowerValue = this.decodeLiteralNumber(element)!;
        return;
      }

      case 'upperValue': {
        target.upperValue = this.decodeLiteralNumber(element)!;
        return;
      }

      case 'defaultValue': {
        const number = this.decodeLiteralNumber(element)!;
        if (null !== number) {
          target.defaultValue = number;
          return;
        }

        const bool = this.decodeLiteralBoolean(element)!;
        if (null !== bool) {
          target.defaultValue = bool;
          return;
        }

        const [uri, type] = this.decodeXMIType(element);
        if (uri === UML && type === 'InstanceValue') {
          target.defaultValue = document.getElementByID(element.getAttribute('instance')!) as EnumerationLiteral;
          return;
        }

        console.error(`Unexpected default value type: ${type}`);
        return;
      }
    }
  }
}
