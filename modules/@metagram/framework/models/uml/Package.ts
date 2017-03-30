import { ModelElement } from './ModelElement';
import { Class, Attribute } from '../../decorators';

@Class('http://www.omg.org/spec/UML/20131001:Package', ModelElement)
export class Package extends ModelElement {
  private _URI: string | null = null;
  private _stereotype: string | null = null;
  private _packagedElement: Set<ModelElement> = new Set();

  @Attribute({ type: String, lower: 0 })
  get URI(): string | null {
    return this._URI;
  }

  set URI(value: string | null) {
    this._URI = value;
  }

  @Attribute({ type: ModelElement, lower: 0, upper: Infinity })
  get packagedElement(): Set<ModelElement> {
    return this._packagedElement;
  }

  set packagedElement(value: Set<ModelElement>) {
    this._packagedElement = value;
  }

  @Attribute({ type: String, lower: 0 })
  get stereotype(): string | null {
    return this._stereotype;
  }

  set stereotype(value: string | null) {
    this._stereotype = value;
  }
}
