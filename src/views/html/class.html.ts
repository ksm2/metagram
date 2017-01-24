import layout from './layout.html';
import attributes from './attributes.html';
import operations from './operations.html';
import { ModelElement } from '../../models/ModelElement';
import { Class } from '../../models/Class';
import { forEach } from './helpers';

export default function (model: Class, baseHref: string, roots: Set<ModelElement>, ref: (m: ModelElement) => string) {
  function generalizations(model: Class): string {
    if (!model.generalizations.size) return '';
    return `<ul>${forEach(model.generalizations, (g) => `<li class="name-ref name-class"><a href="${ref(g)}">${g.name}</a></li>\n${generalizations(g)}`)}</ul>`;
  }

  return layout(model, baseHref, roots, ref, `
    ${model.generalizations.size ? `<section>
      <h2>Generalizations</h2>
      ${generalizations(model)}
    </section>` : ``}
    
    ${model.specializations.size ? `<section>
      <h2>Specializations</h2>
      <ul class="list-unstyled">
        ${forEach(model.specializations, (specialization) => `
          <li class="name-ref name-class"><a href="${ref(specialization)}">${specialization.name}</a>`)}    
      </ul>
    </section>` : ``}
    
    ${attributes(model.ownedAttributes, ref)}
    ${operations(model.ownedOperations, ref)}
  `);
}
