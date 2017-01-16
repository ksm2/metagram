import { Visitor } from './Visitor';
import { EnumerationLiteral } from '../models/EnumerationLiteral';

export class EnumerationLiteralVisitor extends Visitor<EnumerationLiteral> {
  createInstance(): EnumerationLiteral {
    return new EnumerationLiteral();
  }
}
