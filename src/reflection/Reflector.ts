import { Classifier } from '../models/uml/Classifier';
import { Class } from '../models/uml/Class';
import { Enumeration } from '../models/uml/Enumeration';
import { Property } from '../models/uml/Property';
import AnnotationReader, { ClassDecorator, AttributeDecorator, EnumerationDecorator } from '../decorators';
import { PrimitiveType } from '../models/uml/PrimitiveType';

export class Reflector {
  private reflections: Map<string, Classifier>;

  constructor() {
    this.reflections = new Map<string, Classifier>([
      ['http://www.omg.org/spec/UML/20131001:Boolean', this.createPrimitiveType('Boolean')],
      ['http://www.omg.org/spec/UML/20131001:Integer', this.createPrimitiveType('Integer')],
      ['http://www.omg.org/spec/UML/20131001:Real', this.createPrimitiveType('Real')],
      ['http://www.omg.org/spec/UML/20131001:String', this.createPrimitiveType('String')],
      ['http://www.omg.org/spec/UML/20131001:UnlimitedNatural', this.createPrimitiveType('UnlimitedNatural')],
    ]);
  }

  reflect(typeName: string): Classifier {
    const type = this.reflections.get(typeName);
    if (!type) throw new Error(`Could not reflect ${typeName}`);

    return type;
  }

  addType(clazz: Function): Classifier {
    this.getProperties(clazz);

    const clazzInfo = AnnotationReader.readClassAnnotation(clazz, ClassDecorator);
    if (clazzInfo) return this.createClassReflection(clazz, clazzInfo);

    const enumInfo = AnnotationReader.readClassAnnotation(clazz, EnumerationDecorator);
    if (enumInfo) return this.createEnumerationReflection(clazz, enumInfo);

    throw new Error('This class has no @Class or @Enumeration information');
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

  private createClassReflection(clazz: Function, clazzInfo: ClassDecorator): Class {
    const model = new Class();
    model.name = clazz.name;

    const typeName = clazzInfo.name;
    this.reflections.set(typeName, model);

    // Retrieve class generalizations
    for (let generalization of clazzInfo.generalizations) {
      const g = this.addType(generalization);
      if (g instanceof Class) {
        model.generalizations.add(g);
        g.specializations.add(model);
      }
    }

    // Read attribute information
    for (let propertyName of this.getProperties(clazz)) {
      const attribute = AnnotationReader.readPropertyAnnotation(clazz.prototype, propertyName, AttributeDecorator);
      if (!attribute) continue;

      const a = new Property();
      if (attribute.type) Object.defineProperty(a, 'type', { get: () => this.reflect(attribute.type) }); else console.log(attribute);
      a.name = propertyName;
      a.lowerValue = attribute.lower;
      a.upperValue = attribute.upper;

      model.ownedAttributes.add(a);
    }

    return model;
  }

  private createEnumerationReflection(enumeration: Function, enumerationInfo: EnumerationDecorator): Enumeration {
    const model = new Enumeration();
    model.name = enumeration.name;

    const typeName = enumerationInfo.name;
    this.reflections.set(typeName, model);

    return model;
  }

  private createPrimitiveType(name: string): PrimitiveType {
    const p = new PrimitiveType();
    p.name = name;

    return p;
  }
}
