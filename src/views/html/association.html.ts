import layout from './layout.html';
import attributes from './attributes.html';
import { ModelElement } from '../../models/ModelElement';
import { Association } from '../../models/Association';

export default function (model: Association, baseHref: string, roots: Set<ModelElement>, ref: (m: ModelElement) => string) {
  return layout(model, baseHref, roots, ref, `
    ${attributes(model.ownedAttributes, ref)}
  `);
}
