import { Element } from '../../models';
import { PrimitiveType } from '../../models';
import { Visitor } from './Visitor';
import { ResolvedXMINode } from '../encoding/ResolvedXMINode';

export class PrimitiveTypeVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
    return new PrimitiveType();
  }
}
