import layout from './layout.html';
import { ModelElement, Property } from '@metagram/models';

export default function (model: Property, baseHref: string, roots: Set<ModelElement>, ref: (m: ModelElement) => string) {
  return layout(model, baseHref, roots, ref, ``);
}