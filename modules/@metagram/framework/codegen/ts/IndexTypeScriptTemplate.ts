import { Class, Element, ModelElement, Package, XMI } from '../../models';
import { TypeScriptTemplate } from './TypeScriptTemplate';

export class IndexTypeScriptTemplate extends TypeScriptTemplate {
  render(xmi: XMI, options: any, next: (element: Element) => void): string {
    const elements = [...xmi.contents].filter((e) => e instanceof Class || e instanceof Package) as ModelElement[];
    elements.forEach((element) => next(element));

    const { forEach, exportStmt } = TypeScriptTemplate;
    return `/*
 * Index file
 *
 * Generated from Metagram
 * ${new Date()}
 */
${forEach(elements, (model) => exportStmt(model), `\n`)}
`;
  }

  isSupporting(element: Element, options: any): boolean {
    return element instanceof XMI;
  }
}
