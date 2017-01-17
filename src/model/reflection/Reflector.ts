import { Class } from '../models/Class';
import AnnotationReader, { ClassDecorator, AttributeDecorator } from '../decorators';
import { Property } from '../models/Property';

export class Reflector {
  private classReflections: WeakMap<Function, Class>;

  constructor() {
    this.classReflections = new WeakMap<Function, Class>();
  }

  reflectClass(clazz: Function): Class {
    return this.classReflections.get(clazz) || this.createClassReflection(clazz);
  }

  getProperties(func: Function): string[] {
    let current = func.prototype;
    let parent;
    let keys: string[] = [];
    while (parent = Object.getPrototypeOf(current)) {
      const propertyNames = Object.getOwnPropertyNames(current).filter(p => typeof Object.getOwnPropertyDescriptor(current, p).value !== 'function');
      keys = keys.concat(propertyNames);

      current = parent;
    }
    
    return keys;
  }

  private createClassReflection(clazz: Function) {
    this.getProperties(clazz);

    const clazzInfo = AnnotationReader.readClassAnnotation(clazz, ClassDecorator);
    if (!clazzInfo) throw 'This class has no @Class information';

    const model = new Class();
    model.ID = clazzInfo.name;
    model.name = clazz.name;
    for (let generalization of clazzInfo.generalizations) {
      const g = this.reflectClass(generalization);
      model.generalizations.add(g);
      g.specializations.add(model);
    }

    // Read attribute information
    for (let propertyName of this.getProperties(clazz)) {
      const attribute = AnnotationReader.readPropertyAnnotation(clazz.prototype, propertyName, AttributeDecorator);
      if (!attribute) continue;

      const a = new Property();
      a.name = propertyName;
      a.lowerValue = attribute.lower;
      a.upperValue = attribute.upper;

      model.ownedAttributes.add(a);
    }

    this.classReflections.set(clazz, model);
    return model;
  }
}
