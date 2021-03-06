import { Element, XMI } from '../../models';
import { TypeScriptTemplate } from './TypeScriptTemplate';

export class PackageJsonTypeScriptTemplate extends TypeScriptTemplate {
  render(xmi: XMI, options: any, next: (element: Element) => void): string {
    return `{
  "name": "@metagram/untitled",
  "main": "lib/index.js",
  "typings": "lib/index.d.ts",
  "dependencies": {
    "@metagram/framework": "^1.0.0",
    "reflect-metadata": "^0.1.9"
  }
}
`;
  }

  isSupporting(data: any, options: any): boolean {
    return data instanceof XMI;
  }

  generateFilename(data: any, options: any): string {
    return 'package.json';
  }
}
