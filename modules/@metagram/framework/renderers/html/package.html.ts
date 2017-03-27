import layout from './layout.html';
import { ModelElement, Package } from '@metagram/models';
import { forEach, cssClass } from './helpers';

export default function (model: Package, baseHref: string, roots: Set<ModelElement>, ref: (m: ModelElement) => string) {
  return layout(model, baseHref, roots, ref, `
    <section>
      <h2>Packaged Elements</h2>
      <ul class="list-unstyled">
        ${forEach(model.packagedElement, (element) => `
          <li><a class="name-ref name-${cssClass(element)}" href="${ref(element)}">${element.name}</a></li>`)}
      </ul>
    </section>
  `);
}
