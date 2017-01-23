import layout from './layout.html';
import { Element } from '../../models/Element';
import { Class } from '../../models/Class';
import { forEach, cssClass } from './helpers';
import { EnumerationLiteral } from '../../models/EnumerationLiteral';

export default function (model: Class, baseHref: string, ref: (m: Element) => string) {
  function generalizations(model: Class): string {
    if (!model.generalizations.size) return '';
    return `<ul>${forEach(model.generalizations, (g) => `<li class="name-ref name-class"><a href="${ref(g)}">${g.name}</a></li>\n${generalizations(g)}`)}</ul>`;
  }

  return layout(model, baseHref, ref, `
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
            ${attribute.association ? `<a class="name-ref name-association" href="${ref(attribute.association)}">${attribute.association.name}</a>` : ``}
            ${forEach(attribute.comments, (comment) => `
              <p class="comment">${comment}</p>
            `)}
          </li>
        `)}
      </ul>
    </section>` : ``}
  `);
}
