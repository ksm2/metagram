import { Element, XMI } from '../../models';
import { TypeScriptTemplate } from './TypeScriptTemplate';

export class TSConfigTypeScriptTemplate extends TypeScriptTemplate {
  render(xmi: XMI, options: any, next: (element: Element) => void): string {
    return `{
  "compilerOptions": {
    "baseUrl": "./src",
    "outDir": "./lib",
    "target": "es2015",
    "module": "es2015",
    "moduleResolution": "node",
    "declaration": true,
    "sourceMap": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "pretty": true,
    "strictNullChecks": true,
    "skipLibCheck": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "files": [
    "src/index.ts"
  ]
}
`;
  }

  isSupporting(data: any, options: any): boolean {
    return data instanceof XMI;
  }

  generateFilename(data: any, options: any): string {
    return 'tsconfig.json';
  }
}
