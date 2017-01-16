import { Visitor } from './Visitor';
import { Enumeration } from '../models/Enumeration';
import { XMI } from '../models/XMI';
import { Element as ModelElement } from '../models/Element';

export class EnumerationVisitor extends Visitor<Enumeration> {
  createInstance(): Enumeration {
    return new Enumeration();
  }

  visitElement(element: Element, document: XMI, target: Enumeration, model: ModelElement): void {
    if (name === 'ownedLiteral') {
      if (model) {
        target.literals.add(model);
      }
    }
  }
}
