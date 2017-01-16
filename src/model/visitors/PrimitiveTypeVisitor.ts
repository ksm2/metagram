import { Visitor } from './Visitor';
import { PrimitiveType } from '../models/PrimitiveType';

export class PrimitiveTypeVisitor extends Visitor<PrimitiveType> {
  createInstance(): PrimitiveType {
    return new PrimitiveType();
  }
}
