import { Element } from './Element';
import { Type } from './Type';
import { Class, Attribute } from '../decorators';

@Class('TypedElement', Element)
export class TypedElement extends Element {
  private _type: Type;

  @Attribute({ type: Type })
  get type(): Type {
    return this._type;
  }

  set type(value: Type) {
    this._type = value;
  }
}
