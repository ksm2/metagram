import { Type } from './Type';
import { Property } from './Property';
import { Operation } from './Operation';
import { Class, Attribute } from '../decorators';

@Class('Classifier', Type)
export class Classifier extends Type {
  private _ownedAttributes: Set<Property> = new Set();
  private _ownedOperations: Set<Operation> = new Set();
  private _stereotype: string | null = null;

  @Attribute({ type: Property, lower: 0, upper: Infinity })
  get ownedAttributes(): Set<Property> {
    return this._ownedAttributes;
  }

  set ownedAttributes(value: Set<Property>) {
    this._ownedAttributes = value;
  }

  @Attribute({ type: Operation, lower: 0, upper: Infinity })
  get ownedOperations(): Set<Operation> {
    return this._ownedOperations;
  }

  set ownedOperations(value: Set<Operation>) {
    this._ownedOperations = value;
  }

  @Attribute({ type: String, lower: 0 })
  get stereotype(): string | null {
    return this._stereotype;
  }

  set stereotype(value: string | null) {
    this._stereotype = value;
  }
}
