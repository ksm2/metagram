import 'reflect-metadata';

export interface DecoratorFunction<T> extends Function {
  new (...args: any[]): T;
}

export class DecoratorReader {
  private annotationMap: Map<DecoratorFunction<any>, symbol> = new Map();

  create<T>(func: DecoratorFunction<T>): Function {
    const symbol = Symbol(func.name);
    this.annotationMap.set(func, symbol);
    return function () {
      const data = Reflect.construct(func as Function, arguments);
      return Reflect.metadata(symbol, data);
    }
  }

  readClassAnnotation<T>(target: Function, annotation: DecoratorFunction<T>): T | null {
    const symbol = this.annotationMap.get(annotation);
    if (!symbol) return null;

    return Reflect.getMetadata(symbol, target) || null;
  }

  readPropertyAnnotation<T>(target: Function, propertyName: string, annotation: DecoratorFunction<T>): T | null {
    const symbol = this.annotationMap.get(annotation);
    if (!symbol) return null;

    return Reflect.getMetadata(symbol, target, propertyName) || null;
  }
}
