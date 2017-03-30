import { Element } from '../../models';
import { EnumerationLiteral } from '../../models';
import { Visitor } from './Visitor';
import { ResolvedXMINode } from '../encoding/ResolvedXMINode';

export class EnumerationLiteralVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
    return new EnumerationLiteral();
  }
}
