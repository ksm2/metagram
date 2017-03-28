import { Element } from '../../models';
import { DataType } from '../../models';
import { ClassifierVisitor } from './ClassifierVisitor';
import { ResolvedXMINode } from '../encoding/ResolvedXMINode';

export class DataTypeVisitor extends ClassifierVisitor {
  createInstance(node: ResolvedXMINode): Element {
    return new DataType();
  }
}
