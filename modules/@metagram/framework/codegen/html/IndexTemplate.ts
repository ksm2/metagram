import { ModelElement, XMI } from '../../models';
import { Element } from '../../models/Element';
import { HTMLTemplate } from './HTMLTemplate';

export class IndexTemplate extends HTMLTemplate {
  render(element: Element, options: any, next: (element: Element) => void): string {
    const model = element as XMI;
    const { baseHref, roots } = options;

    // Make all child elements next
    model.contents.forEach(content => next(content));

    return this.main('Home', baseHref, roots, 'index', `
      <header>
        <h1 class="display">Metagram</h1>
      </header>
      <main>
      ${model.contents.size ? `<section>
        <ul class="list-unstyled">
          ${this.forEach(model.contents, (ownedElement) => ownedElement instanceof ModelElement ? `
            <li class="name-ref name-${this.cssClass(ownedElement)}"><a href="${this.ref(ownedElement)}">${ownedElement.name}</a>` : '')}    
        </ul>
      </section>` : ``}
      </main>
    `);
  }

  isSupporting(element: Element, options: any): boolean {
    return element instanceof XMI && options.baseHref && options.roots;
  }
}
