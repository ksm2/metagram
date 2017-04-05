import { Element } from '../../models';
import { PrimitiveType } from '../../models';
import { ResolvedXMINode } from '../encoding/ResolvedXMINode';
import { Visitor } from './Visitor';

export class PrimitiveTypeVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
    return new PrimitiveType();
  }
}
