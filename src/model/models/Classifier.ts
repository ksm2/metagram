import { Type } from './Type';
import { Class, Attribute } from '../decorators';
import { Property } from './Property';

@Class('Association', Type)
export class Classifier extends Type {
  private _ownedAttributes: Set<Property> = new Set();

  @Attribute({ type: Property, lower: 0, upper: Infinity })
  get ownedAttributes(): Set<Property> {
    return this._ownedAttributes;
  }

  set ownedAttributes(value: Set<Property>) {
    this._ownedAttributes = value;
  }
}
