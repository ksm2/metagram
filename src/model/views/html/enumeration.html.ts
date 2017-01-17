import layout from './layout.html';
import { Enumeration } from '../../models/Enumeration';
import { forEach, filename, cssClass } from './helpers';

export default function (model: Enumeration, baseHref: string) {
  return layout(model, baseHref, `
    ${model.ownedLiterals.size ? `<section>
      <h2>Owned Literals</h2>
      <ul class="list-unstyled">
        ${forEach(model.ownedLiterals, (literal) => `
          <li>
            <a class="name-ref name-${cssClass(literal)}" href="${filename(literal)}"><strong>${literal.name}</strong></a>
            <p class="comment">${literal.comment}</p>
          </li>
        `)}
      </ul>
    </section>` : ``}
  `);
}
