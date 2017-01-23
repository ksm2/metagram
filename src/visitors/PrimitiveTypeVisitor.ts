import { Visitor } from './Visitor';
import { PrimitiveType } from '../models/PrimitiveType';

export class PrimitiveTypeVisitor extends Visitor {
  createInstance(): PrimitiveType {
    return new PrimitiveType();
  }
}
