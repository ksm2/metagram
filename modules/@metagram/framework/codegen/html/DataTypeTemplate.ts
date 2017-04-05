import { DataType, Element } from '../../models';
import { HTMLTemplate } from './HTMLTemplate';

export class DataTypeTemplate extends HTMLTemplate {
  render(element: Element, options: any, next: (element: Element) => void): string {
    const model = element as DataType;

    // Make all child elements next
    model.ownedAttributes.forEach((content) => next(content));

    return this.layout(model, options, `
      ${this.attributes(model.ownedAttributes)}
    `);
  }

  isSupporting(element: Element, options: any): boolean {
    return element instanceof DataType && options.baseHref && options.roots;
  }
}
