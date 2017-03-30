import layout from './layout.html';
import { ModelElement, EnumerationLiteral } from '../../models';
import { Renderer } from '../../Renderer';

export default function (model: EnumerationLiteral, baseHref: string, renderer: Renderer) {
  return layout(model, baseHref, renderer, ``);
}
