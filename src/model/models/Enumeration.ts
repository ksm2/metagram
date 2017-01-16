import { Type } from './Type';
import { EnumerationLiteral } from './EnumerationLiteral';
import { Class, Attribute } from '../decorators';

@Class('Enumeration', Type)
export class Enumeration extends Type {
  private _literals: Set<EnumerationLiteral> = new Set();

  @Attribute({ type: EnumerationLiteral, lower: 0, upper: Infinity })
  get literals(): Set<EnumerationLiteral> {
    return this._literals;
  }

  set literals(value: Set<EnumerationLiteral>) {
    this._literals = value;
  }
}
