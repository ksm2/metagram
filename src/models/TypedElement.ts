import { ModelElement } from './ModelElement';
import { Type } from './Type';
import { Class, Attribute } from '../decorators';

@Class('TypedElement', ModelElement)
export class TypedElement extends ModelElement {
  private _type: Type;

  @Attribute({ type: Type })
  get type(): Type {
    return this._type;
  }

  set type(value: Type) {
    this._type = value;
  }
}
