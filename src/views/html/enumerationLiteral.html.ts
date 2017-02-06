import layout from './layout.html';
import { ModelElement } from '../../models/uml/ModelElement';
import { EnumerationLiteral } from '../../models/uml/EnumerationLiteral';

export default function (model: EnumerationLiteral, baseHref: string, roots: Set<ModelElement>, ref: (m: ModelElement) => string) {
  return layout(model, baseHref, roots, ref, ``);
}
