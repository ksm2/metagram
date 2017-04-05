import { Attribute, Class } from '../../decorators';
import { ParameterDirectionKind } from './ParameterDirectionKind';
import { DefaultValueType } from './Property';
import { TypedElement } from './TypedElement';

@Class('http://www.omg.org/spec/UML/20131001:Parameter', TypedElement)
export class Parameter extends TypedElement {
  private _defaultValue: DefaultValueType | null = null;
  private _direction: string;

  @Attribute({ type: Object, lower: 0 })
  get defaultValue(): DefaultValueType | null {
    return this._defaultValue;
  }

  set defaultValue(value: DefaultValueType | null) {
    this._defaultValue = value;
  }

  @Attribute({ type: ParameterDirectionKind })
  get direction(): string {
    return this._direction;
  }

  set direction(value: string) {
    this._direction = value;
  }
}
