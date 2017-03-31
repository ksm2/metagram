import { Element } from '../../models/Element';
import { HTMLTemplate } from './HTMLTemplate';
import { ModelElement } from '../../models/uml/ModelElement';

export class DefaultTemplate extends HTMLTemplate {
  render(element: Element, options: any, next: (element: Element) => void): string {
    const model = element as ModelElement;

    // Make all child elements next
    model.contents.forEach(content => next(content));

    return this.layout(model, options, ``);
  }

  isSupporting(element: Element, options: any): boolean {
    return element instanceof ModelElement && options.baseHref && options.roots;
  }
}
