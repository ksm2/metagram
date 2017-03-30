import main from './main.html';
import { ModelElement, XMI } from '../../models';
import { forEach, cssClass } from './helpers';
import { Renderer } from '../../Renderer';

export default function (model: XMI, baseHref: string, renderer: Renderer) {
  return main('Home', baseHref, renderer.roots, 'index', `
    <header>
      <h1 class="display">Metagram</h1>
    </header>
    <main>
    ${model.contents.size ? `<section>
      <ul class="list-unstyled">
        ${forEach(model.contents, (ownedElement) => ownedElement instanceof ModelElement ? `
          <li class="name-ref name-${cssClass(ownedElement)}"><a href="${renderer.ref(ownedElement)}">${ownedElement.name}</a>` : '')}    
      </ul>
    </section>` : ``}
    </main>
  `);
}
