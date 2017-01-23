import { TypedElement } from './TypedElement';
import { DefaultValueType } from './Property';
import { Class, Attribute } from '../decorators';
import { ParameterDirectionKind } from './ParameterDirectionKind';

@Class('Parameter', TypedElement)
export class Parameter extends TypedElement {
  private _defaultValue: DefaultValueType | null = null;
  private _direction: ParameterDirectionKind;

  @Attribute({ type: Object, lower: 0 })
  get defaultValue(): DefaultValueType | null {
    return this._defaultValue;
  }

  set defaultValue(value: DefaultValueType | null) {
    this._defaultValue = value;
  }

  @Attribute({ type: Number })
  get direction(): ParameterDirectionKind {
    return this._direction;
  }

  set direction(value: ParameterDirectionKind) {
    this._direction = value;
  }
}
