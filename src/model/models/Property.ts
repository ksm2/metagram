import { TypedElement } from './TypedElement';
import { Class, Attribute } from '../decorators';
import { EnumerationLiteral } from './EnumerationLiteral';

export type DefaultValueType = boolean | number | EnumerationLiteral;

@Class('Property')
export class Property extends TypedElement {
  private _lowerValue?: number;
  private _upperValue?: number;
  private _defaultValue?: DefaultValueType;

  @Attribute({ type: Number })
  get lower(): number {
    return this._lowerValue || 1;
  }

  @Attribute({ type: Number, lower: 0 })
  get lowerValue(): number | undefined {
    return this._lowerValue;
  }

  set lowerValue(value: number | undefined) {
    this._lowerValue = value;
  }

  @Attribute({ type: Number })
  get upper(): number {
    return this._upperValue || 1;
  }

  @Attribute({ type: Number, lower: 0 })
  get upperValue(): number | undefined {
    return this._upperValue;
  }

  set upperValue(value: number | undefined) {
    this._upperValue = value;
  }

  @Attribute({ type: Object, lower: 0 })
  get defaultValue(): DefaultValueType | undefined {
    return this._defaultValue;
  }

  set defaultValue(value: DefaultValueType | undefined) {
    this._defaultValue = value;
  }

  /**
   * The query isMultivalued() checks whether this multiplicity has an upper bound greater than one.
   */
  isMultivalued(): boolean {
    return this._upperValue > 1;
  }
}
