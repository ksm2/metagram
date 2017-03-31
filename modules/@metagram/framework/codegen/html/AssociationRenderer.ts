import { HTMLTemplate } from './HTMLTemplate';
import { Association } from '../../models/uml/Association';

export class AssociationTemplate extends HTMLTemplate {
  render(data: any, options: any, next: (data: any) => void): string {
    const model = data as Association;

    // Make all child elements next
    model.ownedAttributes.forEach(content => next(content));

    const body = `
      ${this.attributes(model.ownedAttributes)}
    `;
    return this.layout(model, options, body);
  }

  isSupporting(data: any, options: any): boolean {
    return data instanceof Association && options.baseHref && options.roots;
  }
}
