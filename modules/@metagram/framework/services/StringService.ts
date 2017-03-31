export class StringService {
  static lowerCaseFirst(str: string): string {
    return `${str[0].toLowerCase()}${str.substring(1)}`;
  }

  static upperCaseFirst(str: string): string {
    return `${str[0].toUpperCase()}${str.substring(1)}`;
  }

  static camelToHyphenCase(camel: string): string {
    return this.lowerCaseFirst(camel).replace(/([A-Z])/g, _ => '-' + _.toLowerCase());
  }
}
