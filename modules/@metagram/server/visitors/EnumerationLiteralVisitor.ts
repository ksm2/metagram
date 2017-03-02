import { Element } from '@metagram/framework';
import { EnumerationLiteral } from '@metagram/framework';
import { Visitor } from './Visitor';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';

export class EnumerationLiteralVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
    return new EnumerationLiteral();
  }
}
