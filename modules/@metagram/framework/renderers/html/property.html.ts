import layout from './layout.html';
import { ModelElement, Property } from '../../models';
import { Renderer } from '../../Renderer';

export default function (model: Property, baseHref: string, renderer: Renderer) {
  return layout(model, baseHref, renderer, ``);
}
