import layout from './layout.html';
import attributes from './attributes.html';
import operations from './operations.html';
import { ModelElement, Class } from '../../models';
import { forEach } from './helpers';
import { Renderer } from '../../Renderer';

export default function (model: Class, baseHref: string, renderer: Renderer) {
  function generalizations(model: Class): string {
    if (!model.generalizations.size) return '';
    return `<ul>${forEach(model.generalizations, (g) => `<li class="name-ref name-class"><a href="${renderer.ref(g)}">${g.name}</a></li>\n${generalizations(g)}`)}</ul>`;
  }

  return layout(model, baseHref, renderer, `
    ${model.generalizations.size ? `<section>
      <h2>Generalizations</h2>
      ${generalizations(model)}
    </section>` : ``}
    
    ${model.specializations.size ? `<section>
      <h2>Specializations</h2>
      <ul class="list-unstyled">
        ${forEach(model.specializations, (specialization) => `
          <li class="name-ref name-class"><a href="${renderer.ref(specialization)}">${specialization.name}</a>`)}    
      </ul>
    </section>` : ``}
    
    ${attributes(model.ownedAttributes, renderer)}
    ${operations(model.ownedOperations, renderer)}
  `);
}
