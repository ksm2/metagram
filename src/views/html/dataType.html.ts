import layout from './layout.html';
import attributes from './attributes.html';
import { ModelElement } from '../../models/uml/ModelElement';
import { DataType } from '../../models/uml/DataType';

export default function (model: DataType, baseHref: string, roots: Set<ModelElement>, ref: (m: ModelElement) => string) {
  return layout(model, baseHref, roots, ref, `
    ${attributes(model.ownedAttributes, ref)}
  `);
}
