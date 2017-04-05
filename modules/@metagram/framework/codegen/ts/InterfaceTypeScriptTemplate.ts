import { Class, Element, ModelElement } from '../../models';
import { TypeScriptTemplate } from './TypeScriptTemplate';

export class InterfaceTypeScriptTemplate extends TypeScriptTemplate {
  render(model: Class, options: any, next: (element: Element) => void): string {
    // Make all generalizations next
    const { internal } = options;
    model.generalizations.forEach((cls) => next(cls));

    const rootDir = model.allOwningElements().map(() => '..').join('/');
    const imports = new Map<string, string>([
      ['* as Metagram', internal ? `${rootDir}/metamodel` : '@metagram/framework'],
    ]);
    const { forEach, typeOf, pluralize, upperCaseFirst, collectionInterfaceName } = TypeScriptTemplate;

    let extensions = [...model.generalizations].map((g) => `I${g.name}`).join(', ');
    if (extensions) extensions = `extends ${extensions} `;

    model.generalizations.forEach((g) => imports.set(`{ I${g.name} }`, this.bundler.createReference(g, model)));

    const importCb = (ref: ModelElement, name: string) => imports.set(name, this.bundler.createReference(ref, model));
    const text = `${model.comments.size ? `/**
${forEach(model.comments, (cmt) => ` * ${cmt}`, `\n`)}
 */
` : ''}export interface I${model.name} ${extensions}{${forEach(model.ownedAttributes, (attr) => `
${attr.comments.size ? `  /**
${forEach(attr.comments, (cmt) => `   * ${cmt}`, `\n  `)}
   */
  ` : '  '}${attr.name}: ${typeOf(attr.type, importCb)} | undefined;`)}${forEach(model.ownedAttributes, (attr) => `${attr.upper > 1 ? `
  getAll${pluralize(upperCaseFirst(attr.name!))}(): ${collectionInterfaceName(attr)};` : ''}`)}
}
`;

    imports.delete(`I${model.name}`);
    return `${this.generateImports(imports)}

${text}`;
  }

  generateBasename(element: ModelElement): string {
    return `I${element.name}.ts`;
  }

  isSupporting(element: Element, options: any): boolean {
    return element instanceof Class;
  }
}
