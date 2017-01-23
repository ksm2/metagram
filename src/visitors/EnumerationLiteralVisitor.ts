import { Visitor } from './Visitor';
import { Element } from '../models/Element';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { EnumerationLiteral } from '../models/EnumerationLiteral';

export class EnumerationLiteralVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
    return new EnumerationLiteral();
  }
}
