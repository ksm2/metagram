import layout from './layout.html';
import { ModelElement } from '../../models/ModelElement';
import { Property } from '../../models/Property';

export default function (model: Property, baseHref: string, roots: Set<ModelElement>, ref: (m: ModelElement) => string) {
  return layout(model, baseHref, roots, ref, ``);
}
