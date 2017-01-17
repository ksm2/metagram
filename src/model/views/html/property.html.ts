import layout from './layout.html';
import { Property } from '../../models/Property';

export default function (model: Property, baseHref: string) {
  return layout(model, baseHref, ``);
}
