import { ClassifierVisitor } from './ClassifierVisitor';
import { Element } from '../models/Element';
import { DataType } from '../models/DataType';

export class DataTypeVisitor extends ClassifierVisitor {
  createInstance(): Element {
    return new DataType();
  }
}
