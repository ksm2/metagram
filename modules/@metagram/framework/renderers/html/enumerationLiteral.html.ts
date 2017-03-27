import layout from './layout.html';
import { ModelElement, EnumerationLiteral } from '@metagram/models';

export default function (model: EnumerationLiteral, baseHref: string, roots: Set<ModelElement>, ref: (m: ModelElement) => string) {
  return layout(model, baseHref, roots, ref, ``);
}
