import { Element } from './Element';
import { Class, Attribute } from '../decorators';

@Class('Package', Element)
export class Package extends Element {
  private _URI: string | null = null;
  private _packagedElements: Set<Element> = new Set();

  @Attribute(String, 0, 1)
  get URI(): string | null {
    return this._URI;
  }

  set URI(value: string | null) {
    this._URI = value;
  }

  @Attribute(Element, 0, Infinity)
  get packagedElements(): Set<Element> {
    return this._packagedElements;
  }

  set packagedElements(value: Set<Element>) {
    this._packagedElements = value;
  }
}
