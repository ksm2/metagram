import { Element } from '../../models/Element';
import { TypeScriptTemplate } from './TypeScriptTemplate';
import { XMI } from '../../models/xmi/XMI';
import { XMIImpl } from '../../models/xmi/XMIImpl';

export class TSConfigTypeScriptTemplate extends TypeScriptTemplate {
  render(xmi: XMI, options: any, next: (element: Element) => void): string {
    //language=JSON
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
    return data instanceof XMIImpl;
  }

  generateFilename(data: any, options: any): string {
    return 'tsconfig.json';
  }
}
