import { TypedElement } from './TypedElement';
import { Class, Attribute } from '../decorators';
import { EnumerationLiteral } from './EnumerationLiteral';
import { Association } from './Association';

export type DefaultValueType = boolean | number | string | EnumerationLiteral;

@Class('Property', TypedElement)
export class Property extends TypedElement {
  private _lowerValue: number | null = null;
  private _upperValue: number | null = null;
  private _defaultValue: DefaultValueType | null = null;
  private _association: Association | null = null;

  @Attribute({ type: Number })
  get lower(): number {
    return this._lowerValue === null ? 1 : this._lowerValue;
  }

  @Attribute({ type: Number, lower: 0 })
  get lowerValue(): number | null {
    return this._lowerValue;
  }

  set lowerValue(value: number | null) {
    this._lowerValue = value;
  }

  @Attribute({ type: Number })
  get upper(): number {
    return this._upperValue === null ? 1 : this._upperValue;
  }

  @Attribute({ type: Number, lower: 0 })
  get upperValue(): number | null {
    return this._upperValue;
  }

  set upperValue(value: number | null) {
    this._upperValue = value;
  }

  @Attribute({ type: Object, lower: 0 })
  get defaultValue(): DefaultValueType | null {
    return this._defaultValue;
  }

  set defaultValue(value: DefaultValueType | null) {
    this._defaultValue = value;
  }

  @Attribute({ type: Object, lower: 0 })
  get association(): Association | null {
    return this._association;
  }

  set association(value: Association | null) {
    this._association = value;
  }

  /**
   * The query isMultivalued() checks whether this multiplicity has an upper bound greater than one.
   */
  isMultivalued(): boolean {
    return this._upperValue > 1;
  }
}
