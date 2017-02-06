import { Classifier } from './Classifier';
import { EnumerationLiteral } from './EnumerationLiteral';
import { Class, Attribute } from '../../decorators';

@Class('http://www.omg.org/spec/UML/20131001:Enumeration', Classifier)
export class Enumeration extends Classifier {
  private _ownedLiterals: Set<EnumerationLiteral> = new Set();

  @Attribute({ type: 'http://www.omg.org/spec/UML/20131001:EnumerationLiteral', lower: 0, upper: Infinity })
  get ownedLiterals(): Set<EnumerationLiteral> {
    return this._ownedLiterals;
  }

  set ownedLiterals(value: Set<EnumerationLiteral>) {
    this._ownedLiterals = value;
  }
}
