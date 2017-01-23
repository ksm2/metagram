import { ClassifierVisitor } from './ClassifierVisitor';
import { Element } from '../models/Element';
import { Association } from '../models/Association';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';

export class AssociationVisitor extends ClassifierVisitor {
  createInstance(node: ResolvedXMINode): Element {
    return new Association();
  }
}
