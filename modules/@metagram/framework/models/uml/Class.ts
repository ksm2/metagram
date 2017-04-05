import { Attribute, Class as Clazz } from '../../decorators';
import { Classifier } from './Classifier';
import { Property } from './Property';

@Clazz('http://www.omg.org/spec/UML/20131001:Class', Classifier)
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

  getAttribute(name: string): Property | null {
    let attr = super.getAttribute(name);
    if (attr) return attr;

    for (const generalization of this._generalizations) {
      attr = generalization.getAttribute(name);
      if (attr) return attr;
    }

    return null;
  }

  getAttributes(): { [name: string]: Property } {
    const attrs = {};
    for (const generalization of this._generalizations) {
      Object.assign(attrs, generalization.getAttributes());
    }

    Object.assign(attrs, [...this.ownedAttributes].reduce((obj, attr) => Object.assign(obj, { [attr.name!]: attr }), {}));

    return attrs;
  }
}
