import { Element } from '../../models/Element';
import { TypeScriptTemplate } from './TypeScriptTemplate';
import { Package } from '../../models/uml/Package';
import { ModelElement } from '../../models/uml/ModelElement';
import { Class } from '../../models/uml/Class';
import { Enumeration } from '../../models/uml/Enumeration';

export class ModuleTypeScriptTemplate extends TypeScriptTemplate {
  render(pkg: Package, options: any, next: (element: Element) => void): string {
    const elements = [...pkg.packagedElement].filter(e => e instanceof Class || e instanceof Package || e instanceof Enumeration) as ModelElement[];
    elements.forEach(element => next(element));

    // Make all generalizations next
    elements.forEach(cls => next(cls));

    const { forEach, exportStmt } = TypeScriptTemplate;
    return `/*
 * ${pkg.name} module
 *
 * Generated from Metagram
 * ${new Date()}
 */
${forEach(elements, (model) => exportStmt(model), `\n`)}
`;
  }

  isSupporting(element: Element, options: any): boolean {
    return element instanceof Package;
  }
}
