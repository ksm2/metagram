import { ModelElement, EnumerationLiteral, Property } from '@metagram/models';
import { forEach, cssClass } from './helpers';

export default function (properties: Set<Property>, ref: (m: ModelElement) => string) {
  return properties.size ? `<section>
      <h2>Owned Attributes</h2>
      <ul class="list-unstyled">
        ${forEach(properties, (property) => `
          <li>
            <strong class="name-ref name-${cssClass(property)}">${property.name}</strong>
            ${property.type ? `&nbsp;<a class="name-ref name-${cssClass(property.type)}" href="${ref(property.type)}">:${property.type.name}</a>` : ``}
            <span>[${property.lower}..${property.upper === Infinity ? '*' : property.upper}]</span>
            ${property.defaultValue instanceof EnumerationLiteral ? ` 
              <a href="${ref(property.defaultValue)}">=${property.defaultValue.name}</a>
            ` : null !== property.defaultValue ? `
              <span>=${property.defaultValue}</span>
            ` : ``}
            ${property.association ? `&nbsp;<a class="name-ref name-association" href="${ref(property.association)}">${property.association.name}</a>` : ``}
            ${forEach(property.comments, (comment) => `
              <p class="comment">${comment}</p>
            `)}
          </li>
        `)}
      </ul>
    </section>` : '';
}
