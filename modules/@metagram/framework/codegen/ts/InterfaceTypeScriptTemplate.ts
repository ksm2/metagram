import { Element } from '../../models/Element';
import { Class } from '../../models/uml/Class';
import { ModelElement } from '../../models/uml/ModelElement';
import { TypeScriptTemplate } from './TypeScriptTemplate';

export class InterfaceTypeScriptTemplate extends TypeScriptTemplate {
  render(model: Class, options: any, next: (element: Element) => void): string {
    // Make all generalizations next
    model.generalizations.forEach((cls) => next(cls));

    const imports = new Set<ModelElement>();
    const { forEach, typeOf, pluralize, upperCaseFirst, collectionInterfaceName } = TypeScriptTemplate;

    let extensions = [...model.generalizations].map((g) => g.name).join(', ');
    if (extensions) extensions = `extends ${extensions} `;

    model.generalizations.forEach((g) => imports.add(g));

    const text = `${model.comments.size ? `/**
${forEach(model.comments, (cmt) => ` * ${cmt}`, `\n`)}
 */
` : ''}export interface ${model.name} ${extensions}{${forEach(model.ownedAttributes, (attr) => `
${attr.comments.size ? `  /**
${forEach(attr.comments, (cmt) => `   * ${cmt}`, `\n  `)}
   */
  ` : '  '}${attr.name}: ${typeOf(attr.type, (ref) => imports.add(ref))} | undefined;${attr.upper > 1 ? `
  getAll${pluralize(upperCaseFirst(attr.name!))}(): ${collectionInterfaceName(attr)};` : ''}`)}
}
`;

    imports.delete(model);
    const i = [...imports].map((it) => this.bundler.createReference(it, model)).join(`\n`);
    return `import * as Metagram from '@metagram/framework';
${i}

${text}`;
  }

  isSupporting(element: Element, options: any): boolean {
    return element instanceof Class;
  }
}
