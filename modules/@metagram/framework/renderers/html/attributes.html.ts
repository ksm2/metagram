import { ModelElement, EnumerationLiteral, Property } from '../../models';
import { forEach, cssClass } from './helpers';
import { Renderer } from '../../Renderer';

export default function (properties: Set<Property>, renderer: Renderer) {
  return properties.size ? `<section>
      <h2>Owned Attributes</h2>
      <ul class="list-unstyled">
        ${forEach(properties, (property) => `
          <li>
            <strong class="name-ref name-${cssClass(property)}">${property.name}</strong>
            ${property.type ? `&nbsp;<a class="name-ref name-${cssClass(property.type)}" href="${renderer.ref(property.type)}">:${property.type.name}</a>` : ``}
            <span>[${property.lower}..${property.upper === Infinity ? '*' : property.upper}]</span>
            ${property.defaultValue instanceof EnumerationLiteral ? ` 
              <a href="${renderer.ref(property.defaultValue)}">=${property.defaultValue.name}</a>
            ` : null !== property.defaultValue ? `
              <span>=${property.defaultValue}</span>
            ` : ``}
            ${property.association ? `&nbsp;<a class="name-ref name-association" href="${renderer.ref(property.association)}">${property.association.name}</a>` : ``}
            ${forEach(property.comments, (comment) => `
              <p class="comment">${comment}</p>
            `)}
          </li>
        `)}
      </ul>
    </section>` : '';
}
