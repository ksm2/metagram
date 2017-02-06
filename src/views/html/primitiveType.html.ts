import layout from './layout.html';
import { ModelElement } from '../../models/uml/ModelElement';
import { PrimitiveType } from '../../models/uml/PrimitiveType';

export default function (model: PrimitiveType, baseHref: string, roots: Set<ModelElement>, ref: (m: ModelElement) => string) {
  return layout(model, baseHref, roots, ref, ``);
}
