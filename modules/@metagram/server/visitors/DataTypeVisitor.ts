import { Element } from '@metagram/framework';
import { DataType } from '@metagram/framework';
import { ClassifierVisitor } from './ClassifierVisitor';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';

export class DataTypeVisitor extends ClassifierVisitor {
  createInstance(node: ResolvedXMINode): Element {
    return new DataType();
  }
}
