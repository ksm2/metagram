import layout from './layout.html';
import { ModelElement } from '../../models/uml/ModelElement';
import { Package } from '../../models/uml/Package';
import { forEach, cssClass } from './helpers';

export default function (model: Package, baseHref: string, roots: Set<ModelElement>, ref: (m: ModelElement) => string) {
  return layout(model, baseHref, roots, ref, `
    ${model.getDiagrams().size ? `<section class="section-stripes">
      <h2>Diagram</h2>
      <img class="diagram" src="${model.name}/diagram.svg">
    </section>` : ``}
    
    <section>
      <h2>Packaged Elements</h2>
      <ul class="list-unstyled">
        ${forEach(model.packagedElement, (element) => `
          <li><a class="name-ref name-${cssClass(element)}" href="${ref(element)}">${element.name}</a></li>`)}
      </ul>
    </section>
  `);
}
