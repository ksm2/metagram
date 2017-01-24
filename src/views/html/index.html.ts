import main from './main.html';
import { XMI } from '../../models/XMI';
import { ModelElement } from '../../models/ModelElement';
import { forEach, cssClass } from './helpers';

export default function (model: XMI, baseHref: string, roots: Set<ModelElement>, ref: (m: ModelElement) => string) {
  return main('Home', baseHref, roots, 'index', `
    <header>
      <h1 class="display-3">Metagram Specifications</h1>
    </header>
    <main>
    ${model.contents.size ? `<section>
      <ul class="list-unstyled">
        ${forEach(model.contents, (ownedElement) => ownedElement instanceof ModelElement ? `
          <li class="name-ref name-${cssClass(ownedElement)}"><a href="${ref(ownedElement)}">${ownedElement.name}</a>` : '')}    
      </ul>
    </section>` : ``}
    </main>
  `);
}
