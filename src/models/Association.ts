import { Classifier } from './Classifier';
import { Class, Attribute } from '../decorators';
import { Property } from './Property';

@Class('Association', Classifier)
export class Association extends Classifier {
  private _memberEnd: Property[] = [];

  @Attribute({ type: Property, lower: 2, upper: Infinity })
  get memberEnd(): Property[] {
    return this._memberEnd;
  }

  set memberEnd(value: Property[]) {
    this._memberEnd = value;
  }
}
