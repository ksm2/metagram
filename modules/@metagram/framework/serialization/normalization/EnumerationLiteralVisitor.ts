import { Element } from '@metagram/models';
import { EnumerationLiteral } from '@metagram/models';
import { Visitor } from './Visitor';
import { ResolvedXMINode } from '../encoding/ResolvedXMINode';

export class EnumerationLiteralVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
    return new EnumerationLiteral();
  }
}
