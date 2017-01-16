import { Type } from './Type';
import { Property } from './Property';
import { Class as Clazz, Attribute } from '../decorators';

@Clazz('Class', Type)
export class Class extends Type {
  private _attributes: Set<Property> = new Set();
  private _generalizations: Set<Class> = new Set();

  @Attribute({ type: Property, lower: 0, upper: Infinity })
  get attributes(): Set<Property> {
    return this._attributes;
  }

  set attributes(value: Set<Property>) {
    this._attributes = value;
  }

  @Attribute({ type: Class, lower: 0, upper: Infinity })
  get generalizations(): Set<Class> {
    return this._generalizations;
  }

  set generalizations(value: Set<Class>) {
    this._generalizations = value;
  }
}
