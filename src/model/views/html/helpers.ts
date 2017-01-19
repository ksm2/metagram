import { Element } from '../../models/Element';
import { XMI } from '../../models/XMI';

export function lowerCaseFirst(str: string) {
  return `${str[0].toLowerCase()}${str.substring(1)}`;
}

export function camelToHyphenCase(camel: string) {
  return lowerCaseFirst(camel).replace(/([A-Z])/g, _ => '-' + _.toLowerCase());
}

export function cssClass(model: Element) {
  return camelToHyphenCase(model.constructor.name);
}

export function forEach<T>(a: { [Symbol.iterator](): Iterator<T> }, callback: (a: T) => string): string {
  return [...a].map(callback).reduce((a, b) => a + b, '');
}
