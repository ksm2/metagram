import layout from './layout.html';
import { XMI } from '../../models/XMI';
import { Element } from '../../models/Element';
import { forEach, cssClass } from './helpers';

export default function (model: XMI, baseHref: string, ref: (m: Element) => string) {
  return layout(model, baseHref, ref, `
    ${model.ownedElements.size ? `<section>
      <h2>Owned Elements</h2>
      <ul class="list-unstyled">
        ${forEach(model.ownedElements, (ownedElement) => `
          <li class="name-ref name-${cssClass(ownedElement)}"><a href="${ref(ownedElement)}">${ownedElement.name}</a>`)}    
      </ul>
    </section>` : ``}
  `);
}
