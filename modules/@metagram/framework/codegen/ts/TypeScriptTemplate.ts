import { Class, ModelElement, Package, Property } from '../../models';
import { StringService } from '../../services';
import { Template } from '../Template';
import { TypeScriptBundler } from './TypeScriptBundler';

export class TypeScriptTemplate extends Template {
  constructor(protected bundler: TypeScriptBundler) {
    super();
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
      return `export { ${model.name} } from './${model.name}';\nexport { I${model.name} } from './I${model.name}';`;
    }

    return `export { ${model.name} } from './${model.name}';`;
  }

  protected static typeOf(model: ModelElement | null, importCb: (model: ModelElement, type: string) => void = () => {}) {
    if (!model) return 'any';

    switch (model.getHref()) {
      case 'http://www.omg.org/spec/UML/20131001/PrimitiveTypes.xmi#String': return 'string';
      case 'http://www.omg.org/spec/UML/20131001/PrimitiveTypes.xmi#Integer': return 'number';
      case 'http://www.omg.org/spec/UML/20131001/PrimitiveTypes.xmi#UnlimitedNatural': return 'number';
      case 'http://www.omg.org/spec/UML/20131001/PrimitiveTypes.xmi#Real': return 'number';
      case 'http://www.omg.org/spec/UML/20131001/PrimitiveTypes.xmi#Boolean': return 'boolean';
      case 'http://www.omg.org/spec/UML/20131001/UML.xmi#Element': return 'Metagram.Element';
      case 'http://www.omg.org/spec/XMI/20131001/XMI-model.xmi#_XMI-DateTime': return 'Date';
    }

    const name = `${model instanceof Class ? 'I' : ''}${model.name}`;
    importCb(model, `{ ${name} }`);
    return name;
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

  generateImports(map: Map<string, string>): string {
    const array = [...map].sort(([imp1, filename1], [imp2, filename2]) => this.compareFilenames(filename1, filename2));
    return array.map(([imp1, filename1]) => `import ${imp1} from '${filename1}';`).join('\n');
  }

  compareFilenames(fn1: string, fn2: string): number {
    const doesNotStartWithDot = /^[^\.]/;
    if (fn1.match(doesNotStartWithDot) && !fn2.match(doesNotStartWithDot)) return -1;
    if (!fn1.match(doesNotStartWithDot) && fn2.match(doesNotStartWithDot)) return 1;
    if (fn1 < fn2) return -1;
    if (fn1 > fn2) return 1;
    return 0;
  }
}
