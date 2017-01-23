import { Classifier } from './Classifier';
import { Class as Clazz, Attribute } from '../decorators';

@Clazz('Class', Classifier)
export class Class extends Classifier {
  private _generalizations: Set<Class> = new Set();
  private _specializations: Set<Class> = new Set();

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
