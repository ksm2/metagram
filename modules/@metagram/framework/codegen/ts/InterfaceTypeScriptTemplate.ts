import { Element } from '../../models/Element';
import { TypeScriptTemplate } from './TypeScriptTemplate';
import { Class } from '../../models/uml/Class';
import { ModelElement } from '../../models/uml/ModelElement';

export class InterfaceTypeScriptTemplate extends TypeScriptTemplate {
  render(model: Class, options: any, next: (element: Element) => void): string {
    // Make all generalizations next
    model.generalizations.forEach(cls => next(cls));

    const imports = new Set<ModelElement>();
    const { forEach, typeOf, pluralize, upperCaseFirst } = TypeScriptTemplate;

    let extensions = [...model.generalizations].map(g => g.name).join(', ');
    if (extensions) extensions = `extends ${extensions} `;

    model.generalizations.forEach(g => imports.add(g));

    const text = `/**
${forEach(model.comments, cmt => ` * ${cmt}`, `\n`)}
 */
export interface ${model.name} ${extensions}{
${forEach(model.ownedAttributes, (attribute) => `
  /**
  ${forEach(attribute.comments, cmt => ` * ${cmt}`, `\n  `)}
   */
  ${attribute.name}: ${typeOf(attribute.type, (ref) => imports.add(ref))} | undefined;
${attribute.upper > 1 ? `
  getAll${pluralize(upperCaseFirst(attribute.name!))}(): ${attribute.ordered ? 'Ordered' : 'Arbitrary'}${attribute.unique ? 'Unique' : 'Ambiguous'}Collection<${typeOf(attribute.type)}>;
` : ''}
`)}
}
`;

    imports.delete(model);
    const i = [...imports].map(it => this.bundler.createReference(it, model)).join(`\n`);
    return `import { ArbitraryUniqueCollection, ArbitraryAmbiguousCollection, OrderedUniqueCollection, OrderedAmbiguousCollection } from '@metagram/framework';\n${i}\n\n${text}`;
  }

  isSupporting(element: Element, options: any): boolean {
    return element instanceof Class;
  }
}
