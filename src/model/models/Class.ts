import { Type } from './Type';
import { Property } from './Property';
import { Class as Clazz, Attribute } from '../decorators';

@Clazz('Class', Type)
export class Class extends Type {
  private _ownedAttributes: Set<Property> = new Set();
  private _generalizations: Set<Class> = new Set();
  private _specializations: Set<Class> = new Set();

  @Attribute({ type: Property, lower: 0, upper: Infinity })
  get ownedAttributes(): Set<Property> {
    return this._ownedAttributes;
  }

  set ownedAttributes(value: Set<Property>) {
    this._ownedAttributes = value;
  }

  @Attribute({ type: Class, lower: 0, upper: Infinity })
  get generalizations(): Set<Class> {
    return this._generalizations;
  }

  set generalizations(value: Set<Class>) {
    this._generalizations = value;
  }

  @Attribute({ type: Class, lower: 0, upper: Infinity })
  get specializations(): Set<Class> {
    return this._specializations;
  }

  set specializations(value: Set<Class>) {
    this._specializations = value;
  }
}
