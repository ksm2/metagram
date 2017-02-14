import { Classifier } from './Classifier';
import { Class, Attribute } from '../../decorators';
import { Property } from './Property';

@Class('http://www.omg.org/spec/UML/20131001:Association', Classifier)
export class Association extends Classifier {
  private _memberEnd: Property[] = [];
  private _ownedEnd: Set<Property> = new Set();

  @Attribute({ type: 'http://www.omg.org/spec/UML/20131001:Property', lower: 2, upper: Infinity })
  get memberEnd(): Property[] {
    return this._memberEnd;
  }

  set memberEnd(value: Property[]) {
    this._memberEnd = value;
  }

  @Attribute({ type: 'http://www.omg.org/spec/UML/20131001:Property', lower: 0, upper: Infinity })
  get ownedEnd(): Set<Property> {
    return this._ownedEnd;
  }

  set ownedEnd(value: Set<Property>) {
    this._ownedEnd = value;
  }
}
