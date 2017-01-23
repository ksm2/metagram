import layout from './layout.html';
import { ModelElement } from '../../models/ModelElement';
import { PrimitiveType } from '../../models/PrimitiveType';

export default function (model: PrimitiveType, baseHref: string, ref: (m: ModelElement) => string) {
  return layout(model, baseHref, ref, ``);
}
