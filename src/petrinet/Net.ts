import { Namespace, Attribute } from '../decorators';
import { Element } from '../models/Element';

@Namespace('http://spec.moellers.systems/PN')
export class Net extends Element {
  private _name: string;

  @Attribute({ type: String })
  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }
}
