import layout from './layout.html';
import { ModelElement } from '../../models/uml/ModelElement';
import { Property } from '../../models/uml/Property';

export default function (model: Property, baseHref: string, roots: Set<ModelElement>, ref: (m: ModelElement) => string) {
  return layout(model, baseHref, roots, ref, ``);
}
