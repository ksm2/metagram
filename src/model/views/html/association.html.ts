import layout from './layout.html';
import { Element } from '../../models/Element';
import { Association } from '../../models/Association';
import { forEach, cssClass } from './helpers';
import { EnumerationLiteral } from '../../models/EnumerationLiteral';

export default function (model: Association, baseHref: string, ref: (m: Element) => string) {
  return layout(model, baseHref, ref, `
    ${model.ownedAttributes.size ? `<section>
      <h2>Owned Attributes</h2>
      <ul class="list-unstyled">
        ${forEach(model.ownedAttributes, (attribute) => `
          <li>
            <a class="name-ref name-${cssClass(attribute)}" href="${ref(attribute)}"><strong>${attribute.name}</strong></a>
            ${attribute.type ? `<a href="${ref(attribute.type)}">:${attribute.type.name}</a>` : ``}
            <span>[${attribute.lower}..${attribute.upper === Infinity ? '*' : attribute.upper}]</span>
            ${attribute.defaultValue instanceof EnumerationLiteral ? ` 
              <a href="${ref(attribute.defaultValue)}">=${attribute.defaultValue.name}</a>
            ` : null !== attribute.defaultValue ? `
              <span>=${attribute.defaultValue}</span>
            ` : ``}
            ${forEach(attribute.comments, (comment) => `
              <p class="comment">${comment}</p>
            `)}
          </li>
        `)}
      </ul>
    </section>` : ``}
  `);
}
