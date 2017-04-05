import { Element } from '../../models';
import { DataType } from '../../models';
import { ResolvedXMINode } from '../encoding/ResolvedXMINode';
import { ClassifierVisitor } from './ClassifierVisitor';

export class DataTypeVisitor extends ClassifierVisitor {
  createInstance(node: ResolvedXMINode): Element {
    return new DataType();
  }
}
