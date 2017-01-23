import layout from './layout.html';
import { Element } from '../../models/Element';
import { Enumeration } from '../../models/Enumeration';
import { forEach, cssClass } from './helpers';

export default function (model: Enumeration, baseHref: string, ref: (m: Element) => string) {
  return layout(model, baseHref, ref, `
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
