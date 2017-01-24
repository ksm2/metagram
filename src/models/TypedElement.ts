import { ModelElement } from './ModelElement';
import { Type } from './Type';
import { Class, Attribute } from '../decorators';

@Class('TypedElement', ModelElement)
export class TypedElement extends ModelElement {
  private _type: Type | null;

  @Attribute({ type: Type, lower: 0 })
  get type(): Type | null {
    return this._type;
  }

  set type(value: Type | null) {
    this._type = value;
  }
}
