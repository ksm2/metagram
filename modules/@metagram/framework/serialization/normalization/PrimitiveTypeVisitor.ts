import { Element } from '@metagram/models';
import { PrimitiveType } from '@metagram/models';
import { Visitor } from './Visitor';
import { ResolvedXMINode } from '../encoding/ResolvedXMINode';

export class PrimitiveTypeVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
    return new PrimitiveType();
  }
}
