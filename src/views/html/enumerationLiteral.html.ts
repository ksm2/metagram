import layout from './layout.html';
import { Element } from '../../models/Element';
import { EnumerationLiteral } from '../../models/EnumerationLiteral';

export default function (model: EnumerationLiteral, baseHref: string, ref: (m: Element) => string) {
  return layout(model, baseHref, ref, ``);
}
