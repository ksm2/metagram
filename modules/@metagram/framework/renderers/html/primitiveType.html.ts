import layout from './layout.html';
import { ModelElement, PrimitiveType } from '../../models';
import { Renderer } from '../../Renderer';

export default function (model: PrimitiveType, baseHref: string, renderer: Renderer) {
  return layout(model, baseHref, renderer, ``);
}
