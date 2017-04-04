import { Attribute, Class } from '../../decorators';
import { Element } from '../Element';
import { AggregationKind } from './AggregationKind';
import { Association } from './Association';
import { EnumerationLiteral } from './EnumerationLiteral';
import { TypedElement } from './TypedElement';

export type DefaultValueType = boolean | number | string | EnumerationLiteral;

@Class('http://www.omg.org/spec/UML/20131001:Property', TypedElement)
export class Property extends TypedElement {
  private _lowerValue: number | null = null;
  private _upperValue: number | null = null;
  private _ordered: boolean = false;
  private _unique: boolean = true;
  private _defaultValue: DefaultValueType | null = null;
  private _association: Association | null = null;
  private _aggregation: string = AggregationKind.NONE;

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

  @Attribute({ type: Boolean })
  get ordered(): boolean {
    return this._ordered;
  }

  set ordered(value: boolean) {
    this._ordered = value;
  }

  @Attribute({ type: Boolean })
  get unique(): boolean {
    return this._unique;
  }

  set unique(value: boolean) {
    this._unique = value;
  }

  @Attribute({ type: Element, lower: 0 })
  get defaultValue(): DefaultValueType | null {
    return this._defaultValue;
  }

  set defaultValue(value: DefaultValueType | null) {
    this._defaultValue = value;
  }

  @Attribute({ type: Association, lower: 0 })
  get association(): Association | null {
    return this._association;
  }

  set association(value: Association | null) {
    this._association = value;
  }

  @Attribute({ type: AggregationKind })
  get aggregation(): string {
    return this._aggregation;
  }

  set aggregation(value: string) {
    this._aggregation = value;
  }

  /**
   * The query isMultivalued() checks whether this multiplicity has an upper bound greater than one.
   */
  isMultivalued(): boolean {
    return this._upperValue ? this._upperValue > 1 : false;
  }
}
