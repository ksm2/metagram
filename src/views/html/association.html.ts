import layout from './layout.html';
import attributes from './attributes.html';
import { ModelElement } from '../../models/ModelElement';
import { Association } from '../../models/Association';

export default function (model: Association, baseHref: string, ref: (m: ModelElement) => string) {
  return layout(model, baseHref, ref, `
    ${attributes(model.ownedAttributes, ref)}
  `);
}
