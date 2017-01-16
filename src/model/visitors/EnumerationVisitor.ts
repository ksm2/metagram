import { Visitor } from './Visitor';
import { Enumeration } from '../models/Enumeration';
import { XMI } from '../models/XMI';
import { Element as ModelElement } from '../models/Element';

export class EnumerationVisitor extends Visitor<Enumeration> {
  createInstance(): Enumeration {
    return new Enumeration();
  }
}
