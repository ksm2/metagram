import layout from './layout.html';
import attributes from './attributes.html';
import { ModelElement, DataType } from '../../models';
import { Renderer } from '../../Renderer';

export default function (model: DataType, baseHref: string, renderer: Renderer) {
  return layout(model, baseHref, renderer, `
    ${attributes(model.ownedAttributes, renderer)}
  `);
}
