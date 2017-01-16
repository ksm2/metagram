import { Class } from '../models/Class';
import AnnotationReader, { ClassDecorator, AttributeDecorator } from '../decorators';
import { Property } from '../models/Property';

export class Reflector {

  reflectClass(object: Object): Class {
    const clazz = object.constructor;
    this.getProperties(clazz);

    const clazzInfo = AnnotationReader.readClassAnnotation(clazz, ClassDecorator);
    if (!clazzInfo) throw 'This class has no @Class information';

    const model = new Class();
    model.ID = clazzInfo.name;
    model.name = clazz.name;
    console.dir(clazzInfo.generalizations.map((it) => AnnotationReader.readClassAnnotation(it, ClassDecorator)));

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

    return model;
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

}
