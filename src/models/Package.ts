import { ModelElement } from './ModelElement';
import { Class, Attribute } from '../decorators';
import { Diagram } from '../diagram/Diagram';

@Class('Package', ModelElement)
export class Package extends ModelElement {
  private _URI: string | null = null;
  private _stereotype: string | null = null;
  private _packagedElements: Set<ModelElement> = new Set();

  @Attribute(String, 0, 1)
  get URI(): string | null {
    return this._URI;
  }

  set URI(value: string | null) {
    this._URI = value;
  }

  @Attribute(ModelElement, 0, Infinity)
  get packagedElements(): Set<ModelElement> {
    return this._packagedElements;
  }

  set packagedElements(value: Set<ModelElement>) {
    this._packagedElements = value;
  }

  @Attribute({ type: String, lower: 0 })
  get stereotype(): string | null {
    return this._stereotype;
  }

  set stereotype(value: string | null) {
    this._stereotype = value;
  }
}
