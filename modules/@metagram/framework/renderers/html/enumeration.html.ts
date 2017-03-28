import layout from './layout.html';
import { ModelElement, Enumeration } from '../../models';
import { forEach, cssClass } from './helpers';

export default function (model: Enumeration, baseHref: string, roots: Set<ModelElement>, ref: (m: ModelElement) => string) {
  return layout(model, baseHref, roots, ref, `
    ${model.ownedLiterals.size ? `<section>
      <h2>Owned Literals</h2>
      <ul class="list-unstyled">
        ${forEach(model.ownedLiterals, (literal) => `
          <li>
            <a class="name-ref name-${cssClass(literal)}" href="${ref(literal)}"><strong>${literal.name}</strong></a>
            ${forEach(literal.comments, (comment) => `
              <p class="comment">${comment}</p>
            `)}
          </li>
        `)}
      </ul>
    </section>` : ``}
  `);
}
