import layout from './layout.html';
import attributes from './attributes.html';
import { ModelElement } from '../../models/ModelElement';
import { DataType } from '../../models/DataType';

export default function (model: DataType, baseHref: string, ref: (m: ModelElement) => string) {
  return layout(model, baseHref, ref, `
    ${attributes(model.ownedAttributes, ref)}
  `);
}
