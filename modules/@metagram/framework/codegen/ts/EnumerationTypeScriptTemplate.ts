import { Element } from '../../models/Element';
import { TypeScriptTemplate } from './TypeScriptTemplate';
import { Enumeration } from '../../models/uml/Enumeration';
import { StringService } from '../../services/StringService';

export class EnumerationTypeScriptTemplate extends TypeScriptTemplate {
  render(enm: Enumeration, options: any, next: (element: Element) => void): string {
    const { forEach } = TypeScriptTemplate;

    const literals = [...enm.ownedLiterals].map(literal => `'${StringService.camelToSnakeCase(literal.name!)}'`).join(' | ');
    return `/**
${forEach(enm.comments, cmt => ` * ${cmt}`, `\n`)}
 */
export type ${enm.name} = ${literals};
`;
  }

  isSupporting(element: Element, options: any): boolean {
    return element instanceof Enumeration;
  }
}
