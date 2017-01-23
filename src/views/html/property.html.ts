import layout from './layout.html';
import { Element } from '../../models/Element';
import { Property } from '../../models/Property';

export default function (model: Property, baseHref: string, ref: (m: Element) => string) {
  return layout(model, baseHref, ref, ``);
}
