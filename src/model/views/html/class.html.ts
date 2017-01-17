import layout from './layout.html';
import { Class } from '../../models/Class';
import { forEach, filename, cssClass } from './helpers';
import { EnumerationLiteral } from '../../models/EnumerationLiteral';

function generalizations(model: Class): string {
  if (!model.generalizations.size) return '';
  return `<ul>${forEach(model.generalizations, (g) => `<li class="name-ref name-class"><a href="${filename(g)}">${g.name}</a></li>\n${generalizations(g)}`)}</ul>`;
}

export default function (model: Class, baseHref: string) {
  return layout(model, baseHref, `
    ${model.generalizations.size ? `<section>
      <h2>Generalizations</h2>
      ${generalizations(model)}
    </section>` : ``}
    
    ${model.specializations.size ? `<section>
      <h2>Specializations</h2>
      <ul class="list-unstyled">
        ${forEach(model.specializations, (specialization) => `
          <li class="name-ref name-class"><a href="${filename(specialization)}">${specialization.name}</a>`)}    
      </ul>
    </section>` : ``}
    
    ${model.ownedAttributes.size ? `<section>
      <h2>Owned Attributes</h2>
      <ul class="list-unstyled">
        ${forEach(model.ownedAttributes, (attribute) => `
          <li>
            <a class="name-ref name-${cssClass(attribute)}" href="${filename(attribute)}"><strong>${attribute.name}</strong></a>
            ${attribute.type ? `<a href="${filename(attribute.type)}">:${attribute.type.name}</a>` : ``}
            <span>[${attribute.lower}..${attribute.upper === Infinity ? '*' : attribute.upper}]</span>
            ${attribute.defaultValue instanceof EnumerationLiteral ? ` 
              <a href="${filename(attribute.defaultValue)}">=${attribute.defaultValue.name}</a>
            ` : null !== attribute.defaultValue ? `
              <span>=${attribute.defaultValue}</span>
            ` : ``}
            <p class="comment">${attribute.comment}</p>
          </li>
        `)}
      </ul>
    </section>` : ``}
  `);
}
