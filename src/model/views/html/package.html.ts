import layout from './layout.html';
import { Package } from '../../models/Package';
import { forEach, filename, cssClass } from './helpers';

export default function (model: Package, baseHref: string) {
  return layout(model, baseHref, `
    <section>
      <h2>Packaged Elements</h2>
      <ul class="list-unstyled">
        ${forEach(model.packagedElements, (element) => `
          <li><a class="name-ref name-${cssClass(element)}" href="${filename(element)}">${element.name}</a></li>`)}
      </ul>
    </section>
  `);
}
