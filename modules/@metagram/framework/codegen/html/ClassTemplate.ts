import { Class, Element } from '../../models';
import { HTMLTemplate } from './HTMLTemplate';

export class ClassTemplate extends HTMLTemplate {
  render(element: Element, options: any, next: (element: Element) => void): string {
    const model = element as Class;

    // Make all child elements next
    model.generalizations.forEach((cls) => next(cls));
    model.specializations.forEach((cls) => next(cls));
    model.ownedAttributes.forEach((content) => next(content));
    model.ownedOperations.forEach((content) => next(content));

    return this.layout(model, options, `
    ${model.generalizations.size ? `<section>
      <h2>Generalizations</h2>
      ${this.generalizations(model)}
    </section>` : ``}

    ${model.specializations.size ? `<section>
      <h2>Specializations</h2>
      <ul class="list-unstyled">
        ${this.forEach(model.specializations, (specialization) => `
          <li class="name-ref name-class"><a href="${this.ref(specialization)}">${specialization.name}</a>`)}
      </ul>
    </section>` : ``}

    ${this.attributes(model.ownedAttributes)}
    ${this.operations(model.ownedOperations)}
  `);
  }

  isSupporting(element: Element, options: any): boolean {
    return element instanceof Class && options.baseHref && options.roots;
  }

  private generalizations(model: Class): string {
    if (!model.generalizations.size) return '';
    return `<ul>
      ${this.forEach(model.generalizations, (g) => `
        <li class="name-ref name-class"><a href="${this.ref(g)}">${g.name}</a></li>\n${this.generalizations(g)}`)}
    </ul>`;
  }
}
