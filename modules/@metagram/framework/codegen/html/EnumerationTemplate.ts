import { Element } from '../../models/Element';
import { Enumeration } from '../../models/uml/Enumeration';
import { HTMLTemplate } from './HTMLTemplate';

export class EnumerationTemplate extends HTMLTemplate {
  render(element: Element, options: any, next: (element: Element) => void): string {
    const model = element as Enumeration;

    // Make all child elements next
    model.ownedLiterals.forEach((literal) => next(literal));

    return this.layout(model, options, `
      ${model.ownedLiterals.size ? `<section>
        <h2>Owned Literals</h2>
        <ul class="list-unstyled">
          ${this.forEach(model.ownedLiterals, (literal) => `
            <li>
              <a class="name-ref name-${this.cssClass(literal)}" href="${this.ref(literal)}"><strong>${literal.name}</strong></a>
              ${this.forEach(literal.comments, (comment) => `
                <p class="comment">${comment}</p>
              `)}
            </li>
          `)}
        </ul>
      </section>` : ``}
    `);
  }

  isSupporting(element: Element, options: any): boolean {
    return element instanceof Enumeration && options.baseHref && options.roots;
  }
}
