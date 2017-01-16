import { Visitor } from './Visitor';
import { Class } from '../models/Class';
import { Property } from '../models/Property';
import { XMI } from '../models/XMI';
import { Element as ModelElement } from '../models/Element';

export class ClassVisitor extends Visitor<Class> {
  createInstance(): Class {
    return new Class();
  }

  visitElement(element: Element, document: XMI, target: Class, model: ModelElement): void {
    switch (name) {
      case 'ownedAttribute': {
        if (model && model instanceof Property) {
          target.attributes.add(model);
        }

        return;
      }

      case 'generalization': {
        const general = document.getElementByID(element.getAttribute('general')!) as Class;
        target.generalizations.add(general);

        return;
      }
    }
  }
}
