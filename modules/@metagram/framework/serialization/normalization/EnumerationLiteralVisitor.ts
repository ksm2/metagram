import { Element } from '../../models';
import { EnumerationLiteral } from '../../models';
import { ResolvedXMINode } from '../encoding/ResolvedXMINode';
import { Visitor } from './Visitor';

export class EnumerationLiteralVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
    return new EnumerationLiteral();
  }
}
