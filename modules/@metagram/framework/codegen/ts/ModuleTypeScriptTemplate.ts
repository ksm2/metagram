import { Element, ModelElement, Package } from '../../models';
import { TypeScriptTemplate } from './TypeScriptTemplate';

export class ModuleTypeScriptTemplate extends TypeScriptTemplate {
  render(pkg: Package, options: any, next: (element: Element) => void): string {
    const elements = [...pkg.packagedElement].filter((e) => this.bundler.isSupporting(e)) as ModelElement[];
    elements.forEach((element) => next(element));

    // Make all generalizations next
    elements.forEach((cls) => next(cls));

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
