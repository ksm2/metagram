import { Visitor } from './Visitor';
import { Element } from '../models/Element';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { PrimitiveType } from '../models/uml/PrimitiveType';

export class PrimitiveTypeVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
    return new PrimitiveType();
  }
}
