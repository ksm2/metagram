import { Element } from '../../models/Element';
import { Class } from '../../models/uml/Class';
import { ModelElement } from '../../models/uml/ModelElement';
import { TypeScriptTemplate } from './TypeScriptTemplate';

function values<T>(o: { [key: string]: T }): T[] {
  const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
  return Reflect.ownKeys(o).reduce((v, k) => v.concat(typeof k === 'string' && isEnumerable(o, k) ? [o[k]] : []), [] as any[]);
}

export class ClassTypeScriptTemplate extends TypeScriptTemplate {
  render(model: Class, options: any, next: (element: Element) => void): string {
    // Make all generalizations next
    model.generalizations.forEach((cls) => next(cls));

    const imports = new Set<ModelElement>();
    const { forEach, typeOf, pluralize, upperCaseFirst, attributeConstructor, collectionInterfaceName } = ClassTypeScriptTemplate;
    const attrs = values(model.getAttributes());
    const text = `${model.comments.size ? `/**
${forEach(model.comments, (cmt) => ` * ${cmt}`, `\n`)}
 */
` : ''}export class ${model.name}Impl extends Metagram.Element implements ${model.name} {${forEach(attrs, (attr) => `
  private _${pluralize(attr.name!)}: Metagram.Attribute<${typeOf(attr.type, (ref) => imports.add(ref))}>;`)}

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

Metagram.Metamodel.registerModel('${model.getHref()}', ${model.name}Impl);
`;

    imports.delete(model);
    const otherImports = [...imports].map((it) => this.bundler.createReference(it, model)).join(`\n`);
    return `import * as Metagram from '@metagram/framework';
${otherImports}
import { ${model.name} } from './${model.name}';

${text}`;
  }

  generateBasename(element: ModelElement): string {
    return `${element.name}Impl.ts`;
  }

  isSupporting(element: Element, options: any): boolean {
    return element instanceof Class;
  }
}
