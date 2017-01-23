import layout from './layout.html';
import { ModelElement } from '../../models/ModelElement';
import { EnumerationLiteral } from '../../models/EnumerationLiteral';

export default function (model: EnumerationLiteral, baseHref: string, ref: (m: ModelElement) => string) {
  return layout(model, baseHref, ref, ``);
}
