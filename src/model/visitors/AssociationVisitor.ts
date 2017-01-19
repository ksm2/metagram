import { ClassifierVisitor } from './ClassifierVisitor';
import { Element } from '../models/Element';
import { Association } from '../models/Association';

export class AssociationVisitor extends ClassifierVisitor {
  createInstance(): Element {
    return new Association();
  }
}
