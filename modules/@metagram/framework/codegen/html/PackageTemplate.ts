import { Element } from '../../models/Element';
import { HTMLTemplate } from './HTMLTemplate';
import { Package } from '../../models/uml/Package';

export class PackageTemplate extends HTMLTemplate {
  render(element: Element, options: any, next: (element: Element) => void): string {
    const model = element as Package;

    // Make all child elements next
    model.packagedElement.forEach(cls => next(cls));

    return this.layout(model, options, `
      <section>
        <h2>Packaged Elements</h2>
        <ul class="list-unstyled">
          ${this.forEach(model.packagedElement, (element) => `
            <li><a class="name-ref name-${this.cssClass(element)}" href="${this.ref(element)}">${element.name}</a></li>`)}
        </ul>
      </section>
    `);
  }

  isSupporting(element: Element, options: any): boolean {
    return element instanceof Package && options.baseHref && options.roots;
  }
}
