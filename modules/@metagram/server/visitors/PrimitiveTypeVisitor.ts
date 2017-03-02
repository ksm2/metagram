import { Element } from '@metagram/framework';
import { PrimitiveType } from '@metagram/framework';
import { Visitor } from './Visitor';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';

export class PrimitiveTypeVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
    return new PrimitiveType();
  }
}
