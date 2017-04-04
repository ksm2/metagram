import { Element } from '../../models/Element';
import { Package } from '../../models/uml/Package';
import { HTMLTemplate } from './HTMLTemplate';

export class PackageTemplate extends HTMLTemplate {
  render(pkg: Package, options: any, next: (element: Element) => void): string {
    // Make all packaged elements next
    pkg.packagedElement.forEach((cls) => next(cls));

    return this.layout(pkg, options, `
      <section>
        <h2>Packaged Elements</h2>
        <ul class="list-unstyled">
          ${this.forEach(pkg.packagedElement, (packaged) => `
            <li><a class="name-ref name-${this.cssClass(packaged)}" href="${this.ref(packaged)}">${packaged.name}</a></li>`)}
        </ul>
      </section>
    `);
  }

  isSupporting(element: Element, options: any): boolean {
    return element instanceof Package && options.baseHref && options.roots;
  }
}
