import layout from './layout.html';
import { ModelElement, Package } from '../../models';
import { forEach, cssClass } from './helpers';
import { Renderer } from '../../Renderer';

export default function (model: Package, baseHref: string, renderer: Renderer) {
  return layout(model, baseHref, renderer, `
    <section>
      <h2>Packaged Elements</h2>
      <ul class="list-unstyled">
        ${forEach(model.packagedElement, (element) => `
          <li><a class="name-ref name-${cssClass(element)}" href="${renderer.ref(element)}">${element.name}</a></li>`)}
      </ul>
    </section>
  `);
}
