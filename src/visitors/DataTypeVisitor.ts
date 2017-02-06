import { ClassifierVisitor } from './ClassifierVisitor';
import { Element } from '../models/Element';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { DataType } from '../models/uml/DataType';

export class DataTypeVisitor extends ClassifierVisitor {
  createInstance(node: ResolvedXMINode): Element {
    return new DataType();
  }
}
