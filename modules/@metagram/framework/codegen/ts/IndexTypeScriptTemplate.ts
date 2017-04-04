import { Element } from '../../models/Element';
import { TypeScriptTemplate } from './TypeScriptTemplate';
import { StringService } from '../../services/StringService';
import { XMI } from '../../models/xmi/XMI';
import { Package } from '../../models/uml/Package';
import { ModelElement } from '../../models/uml/ModelElement';
import { Class } from '../../models/uml/Class';
import { XMIImpl } from '../../models/xmi/XMIImpl';

export class IndexTypeScriptTemplate extends TypeScriptTemplate {
  render(xmi: XMIImpl, options: any, next: (element: Element) => void): string {
    const elements = [...xmi.contents].filter(e => e instanceof Class || e instanceof Package) as ModelElement[];
    elements.forEach(element => next(element));

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
    return element instanceof XMIImpl;
  }
}
