import { Class } from '../../models/uml/Class';
import { ModelElement } from '../../models/uml/ModelElement';
import { Package } from '../../models/uml/Package';
import { Property } from '../../models/uml/Property';
import { StringService } from '../../services/StringService';
import { Template } from '../Template';
import { TypeScriptBundler } from './TypeScriptBundler';

export class TypeScriptTemplate extends Template {
  constructor(protected bundler: TypeScriptBundler) {
    super();
  }

  generateFilename(data: any, options: any = {}): string {
    if (data instanceof Package) {
      return `${this.bundler.getPackageDirectory(data)}/index.ts`;
    }

    if (data instanceof ModelElement) {
      const path = this.bundler.getPackageDirectory(data.owningElement);
      const basename = this.generateBasename(data);
      return `${path}/${basename}`;
    }

    return 'src/index.ts';
  }

  generateBasename(element: ModelElement): string {
    return `${element.name}.ts`;
  }

  protected static forEach<T>(
    a: { [Symbol.iterator](): Iterator<T> },
    callback: (a: T) => string,
    separator: string = '',
  ): string {
    return [...a].map(callback).join(separator);
  }

  protected static exportStmt(model: ModelElement) {
    if (model instanceof Package) {
      return `export * from './${StringService.camelToHyphenCase(model.name || '')}';`;
    }

    if (model instanceof Class) {
      return `export { ${model.name} } from './${model.name}';\nexport { ${model.name}Impl } from './${model.name}Impl';`;
    }

    return `export { ${model.name} } from './${model.name}';`;
  }

  protected static typeOf(model: ModelElement | null, importCb: (type: ModelElement) => void = () => {}) {
    if (!model) return 'any';

    switch (model.getHref()) {
      case 'http://www.omg.org/spec/UML/20131001/PrimitiveTypes.xmi#String': return 'string';
      case 'http://www.omg.org/spec/UML/20131001/PrimitiveTypes.xmi#Integer': return 'number';
      case 'http://www.omg.org/spec/UML/20131001/PrimitiveTypes.xmi#UnlimitedNatural': return 'number';
      case 'http://www.omg.org/spec/UML/20131001/PrimitiveTypes.xmi#Real': return 'number';
      case 'http://www.omg.org/spec/UML/20131001/PrimitiveTypes.xmi#Boolean': return 'boolean';
    }

    importCb(model);
    return model.name!;
  }

  protected static pluralize(str: string): string {
    return StringService.pluralize(str);
  }

  protected static upperCaseFirst(str: string): string {
    return StringService.upperCaseFirst(str);
  }

  protected static attributeConstructor(attr: Property): string {
    const typeOf = TypeScriptTemplate.typeOf;
    return `new Metagram.Attribute<${typeOf(attr.type)}>('${attr.name!}', ${attr.ordered}, ${attr.unique}, ${attr.lower}, ${attr.upper})`;
  }

  protected static collectionInterfaceName(attr: Property): string {
    const typeOf = TypeScriptTemplate.typeOf;
    return `Metagram.${attr.ordered ? 'Ordered' : 'Arbitrary'}${attr.unique ? 'Unique' : 'Ambiguous'}Collection<${typeOf(attr.type)}>`;
  }
}
