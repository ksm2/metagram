import { Class, Element, ModelElement } from '../../models';
import { TypeScriptTemplate } from './TypeScriptTemplate';

function values<T>(o: { [key: string]: T }): T[] {
  const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
  return Reflect.ownKeys(o).reduce((v, k) => v.concat(typeof k === 'string' && isEnumerable(o, k) ? [o[k]] : []), [] as any[]);
}

export class ClassTypeScriptTemplate extends TypeScriptTemplate {
  render(model: Class, options: any, next: (element: Element) => void): string {
    // Make all generalizations next
    const { internal } = options;
    model.generalizations.forEach((cls) => next(cls));

    const rootDir = model.allOwningElements().map(() => '..').join('/');
    const imports = new Map<string, string>([
      ['* as Metagram', internal ? `${rootDir}/metamodel` : '@metagram/framework'],
      [`{ I${model.name} }`, `./I${model.name}`],
    ]);

    const { forEach, typeOf, pluralize, upperCaseFirst, attributeConstructor, collectionInterfaceName } = ClassTypeScriptTemplate;
    const attrs = values(model.getAttributes());
    const importCb = (ref: ModelElement, name: string) => imports.set(name, this.bundler.createReference(ref, model));
    const text = `${model.comments.size ? `/**
${forEach(model.comments, (cmt) => ` * ${cmt}`, `\n`)}
 */
` : ''}export class ${model.name} extends Metagram.Element implements I${model.name} {${forEach(attrs, (attr) => `
  private _${pluralize(attr.name!)}: Metagram.Attribute<${typeOf(attr.type, importCb)}>;`)}

  constructor() {
    super();
${forEach(attrs, (attr) => `
    this._${pluralize(attr.name!)} = ${attributeConstructor(attr)};`)}
  }
${forEach(attrs, (attr) => `
  set ${attr.name}(value: ${typeOf(attr.type)} | undefined) {
    this._${pluralize(attr.name!)}.set(value);
  }

  get ${attr.name}(): ${typeOf(attr.type)} | undefined {
    return this._${pluralize(attr.name!)}.get()${attr.lower >= 1 ? '!' : ''};
  }

  getAll${pluralize(upperCaseFirst(attr.name!))}(): ${collectionInterfaceName(attr)} {
    return this._${pluralize(attr.name!)}.as${attr.ordered ? 'Ordered' : ''}${attr.unique ? 'Set' : 'List'}();
  }
${attr.upper > attr.lower ? `
  append${upperCaseFirst(attr.name!)}(value: ${typeOf(attr.type)}): boolean {
    return this._${pluralize(attr.name!)}.append(value);
  }

  remove${upperCaseFirst(attr.name!)}(value: ${typeOf(attr.type)}): boolean {
    return this._${pluralize(attr.name!)}.remove(value);
  }
` : ''}${attr.lower < 1 ? `
  has${upperCaseFirst(attr.name!)}(): boolean {
    return this._${pluralize(attr.name!)}.isNotEmpty();
  }
` : ''}`)}}

Metagram.Metamodel.registerModel('${model.getHref()}', ${model.name});
`;

    return `${this.generateImports(imports)}

${text}`;
  }

  isSupporting(element: Element, options: any): boolean {
    return element instanceof Class;
  }
}
