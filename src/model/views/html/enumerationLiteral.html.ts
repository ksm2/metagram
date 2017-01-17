import layout from './layout.html';
import { EnumerationLiteral } from '../../models/EnumerationLiteral';

export default function (model: EnumerationLiteral, baseHref: string) {
  return layout(model, baseHref, ``);
}
