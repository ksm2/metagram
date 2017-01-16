import { Type } from './Type';
import { EnumerationLiteral } from './EnumerationLiteral';
import { Class, Attribute } from '../decorators';

@Class('Enumeration', Type)
export class Enumeration extends Type {
  private _ownedLiterals: Set<EnumerationLiteral> = new Set();

  @Attribute({ type: EnumerationLiteral, lower: 0, upper: Infinity })
  get ownedLiterals(): Set<EnumerationLiteral> {
    return this._ownedLiterals;
  }

  set ownedLiterals(value: Set<EnumerationLiteral>) {
    this._ownedLiterals = value;
  }
}
