import { Element } from '../../models/Element';
import { ModelElement } from '../../models/ModelElement';
import { Package } from '../../models/Package';
import KNOWN_MODELS from '../../knownModels';

export function lowerCaseFirst(str: string) {
  return `${str[0].toLowerCase()}${str.substring(1)}`;
}

export function camelToHyphenCase(camel: string) {
  return lowerCaseFirst(camel).replace(/([A-Z])/g, _ => '-' + _.toLowerCase());
}

export function cssClass(model: Element) {
  return camelToHyphenCase(model.constructor.name);
}

export function forEach<T>(a: { [Symbol.iterator](): Iterator<T> }, callback: (a: T) => string, separator: string = ''): string {
  return [...a].map(callback).join(separator);
}

export function uriNameFor(model: ModelElement) {
  const root = model.getRoot();
  if (root instanceof Package) {
    const info = KNOWN_MODELS.get(root.URI!);
    if (info) return `${info.name} (v${info.version})`;
  }

  return model.getOrigin();
}
