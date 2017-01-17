import layout from './layout.html';
import { PrimitiveType } from '../../models/PrimitiveType';

export default function (model: PrimitiveType, baseHref: string) {
  return layout(model, baseHref, ``);
}
