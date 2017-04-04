import { Element } from '../../models/Element';
import { TypeScriptTemplate } from './TypeScriptTemplate';
import { Class } from '../../models/uml/Class';
import { ModelElement } from '../../models/uml/ModelElement';

function values<T>(o: { [key: string]: T }): T[] {
  const isEnumerable = Function.bind.call(Function.call, Object.prototype.propertyIsEnumerable);
  return Reflect.ownKeys(o).reduce((v, k) => v.concat(typeof k === 'string' && isEnumerable(o, k) ? [o[k]] : []), [] as any[]);
}

export class ClassTypeScriptTemplate extends TypeScriptTemplate {
  render(model: Class, options: any, next: (element: Element) => void): string {
    // Make all generalizations next
    model.generalizations.forEach(cls => next(cls));

    const imports = new Set<ModelElement>();
    const { forEach, typeOf, pluralize, upperCaseFirst } = TypeScriptTemplate;
    const text = `/**
${forEach(model.comments, cmt => ` * ${cmt}`, `\n`)}
 */
export class ${model.name}Impl extends $Elm implements ${model.name} {
${forEach(values(model.getAttributes()), (attribute) => `
  private _${pluralize(attribute.name!)}: $Attr<${typeOf(attribute.type, (ref) => imports.add(ref))}> = new $Attr<${typeOf(attribute.type)}>('${attribute.name!}', ${attribute.ordered}, ${attribute.unique}, ${attribute.lower}, ${attribute.upper});`)}
  
${forEach(values(model.getAttributes()), (attribute) => `
  set ${attribute.name}(value: ${typeOf(attribute.type)} | undefined) { 
    this._${pluralize(attribute.name!)}.set(value); 
  }
  
  get ${attribute.name}(): ${typeOf(attribute.type)} | undefined {
    return this._${pluralize(attribute.name!)}.get()${attribute.lower >= 1 ? '!' : ''}; 
  }

  getAll${pluralize(upperCaseFirst(attribute.name!))}(): ${attribute.ordered ? 'Ordered' : 'Arbitrary'}${attribute.unique ? 'Unique' : 'Ambiguous'}Collection<${typeOf(attribute.type)}> { 
    return this._${pluralize(attribute.name!)}.as${attribute.ordered ? 'Ordered' : ''}${attribute.unique ? 'Set' : 'List'}(); 
  }
${attribute.upper > attribute.lower ? `
  append${upperCaseFirst(attribute.name!)}(value: ${typeOf(attribute.type)}): boolean { 
    return this._${pluralize(attribute.name!)}.append(value); 
  }
  
  remove${upperCaseFirst(attribute.name!)}(value: ${typeOf(attribute.type)}): boolean {
    return this._${pluralize(attribute.name!)}.remove(value); 
  }
` : ''}${attribute.lower < 1 ? `
  has${upperCaseFirst(attribute.name!)}(): boolean {
    return this._${pluralize(attribute.name!)}.isNotEmpty(); 
  }
` : ''}
`)}
}

$MM.registerModel('${model.getHref()}', ${model.name}Impl);
`;

    imports.delete(model);
    const i = [...imports].map(it => this.bundler.createReference(it, model)).join(`\n`);
    return `import { Element as $Elm, Attribute as $Attr, Metamodel as $MM, ArbitraryUniqueCollection, ArbitraryAmbiguousCollection, OrderedUniqueCollection, OrderedAmbiguousCollection } from '@metagram/framework';\n${i}\nimport { ${model.name} } from './${model.name}';\n\n${text}`;
  }

  generateBasename(element: ModelElement): string {
    return `${element.name}Impl.ts`;
  }

  isSupporting(element: Element, options: any): boolean {
    return element instanceof Class;
  }
}
