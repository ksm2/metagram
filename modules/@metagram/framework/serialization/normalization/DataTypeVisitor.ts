import { Element } from '@metagram/models';
import { DataType } from '@metagram/models';
import { ClassifierVisitor } from './ClassifierVisitor';
import { ResolvedXMINode } from '../encoding/ResolvedXMINode';

export class DataTypeVisitor extends ClassifierVisitor {
  createInstance(node: ResolvedXMINode): Element {
    return new DataType();
  }
}
