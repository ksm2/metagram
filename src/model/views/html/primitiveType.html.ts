import layout from './layout.html';
import { Element } from '../../models/Element';
import { PrimitiveType } from '../../models/PrimitiveType';

export default function (model: PrimitiveType, baseHref: string, ref: (m: Element) => string) {
  return layout(model, baseHref, ref, ``);
}
