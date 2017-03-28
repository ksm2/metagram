import layout from './layout.html';
import { ModelElement, PrimitiveType } from '../../models';

export default function (model: PrimitiveType, baseHref: string, roots: Set<ModelElement>, ref: (m: ModelElement) => string) {
  return layout(model, baseHref, roots, ref, ``);
}
