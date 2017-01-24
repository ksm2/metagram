import layout from './layout.html';
import { ModelElement } from '../../models/ModelElement';
import { Package } from '../../models/Package';
import { forEach, cssClass } from './helpers';

export default function (model: Package, baseHref: string, roots: Set<ModelElement>, ref: (m: ModelElement) => string) {
  return layout(model, baseHref, roots, ref, `
    <section>
      <h2>Packaged Elements</h2>
      <ul class="list-unstyled">
        ${forEach(model.packagedElements, (element) => `
          <li><a class="name-ref name-${cssClass(element)}" href="${ref(element)}">${element.name}</a></li>`)}
      </ul>
    </section>
  `);
}
