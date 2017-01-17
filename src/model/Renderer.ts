import { FileService } from './FileService';
import { Element } from './models/Element';
import { Class } from './models/Class';
import { Package } from './models/Package';
import { Enumeration } from './models/Enumeration';
import { EnumerationLiteral } from './models/EnumerationLiteral';
import { Property } from './models/Property';
import { PrimitiveType } from './models/PrimitiveType';
import { filename } from './views/html/helpers';

import classRenderer from './views/html/class.html';
import packageRenderer from './views/html/package.html';
import enumerationRenderer from './views/html/enumeration.html';
import enumerationLiteralRenderer from './views/html/enumerationLiteral.html';
import propertyRenderer from './views/html/property.html';
import primitiveTypeRenderer from './views/html/primitiveType.html';

export class Renderer {
  constructor(
    private fileService: FileService,
    private baseHref: string,
    private outputDir: string,
  ) {
  }

  async render(element: Element): Promise<void> {
    if (element instanceof Class) {
      await this.renderClass(element);
    } else if (element instanceof Package) {
      await this.renderPackage(element);
    } else if (element instanceof Enumeration) {
      await this.renderEnumeration(element);
    } else if (element instanceof EnumerationLiteral) {
      await this.renderEnumerationLiteral(element);
    } else if (element instanceof Property) {
      await this.renderProperty(element);
    } else if (element instanceof PrimitiveType) {
      await this.renderPrimitiveType(element);
    }

    for (let child of element) {
      await this.render(child);
    }
  }

  async copyAssets(): Promise<void> {
    await this.fileService.copyDirectory(__dirname + '/../../public', this.outputDir);
  }

  async renderClass(model: Class): Promise<void>  {
    await this.writeOut(model, `${this.outputDir}/${filename(model)}`, classRenderer).catch(e => { throw e });
  }

  async renderPackage(model: Package): Promise<void>  {
    await this.writeOut(model, `${this.outputDir}/${filename(model)}`, packageRenderer).catch(e => { throw e });
  }

  async renderEnumeration(model: Enumeration): Promise<void>  {
    await this.writeOut(model, `${this.outputDir}/${filename(model)}`, enumerationRenderer).catch(e => { throw e });
  }

  async renderEnumerationLiteral(model: EnumerationLiteral): Promise<void>  {
    await this.writeOut(model, `${this.outputDir}/${filename(model)}`, enumerationLiteralRenderer).catch(e => { throw e });
  }

  async renderProperty(model: Property): Promise<void>  {
    await this.writeOut(model, `${this.outputDir}/${filename(model)}`, propertyRenderer).catch(e => { throw e });
  }

  async renderPrimitiveType(model: PrimitiveType): Promise<void>  {
    await this.writeOut(model, `${this.outputDir}/${filename(model)}`, primitiveTypeRenderer).catch(e => { throw e });
  }

  async writeOut<T>(model: T, filename: string, renderer: (t: T, b: string) => string): Promise<void> {
    const str = renderer(model, this.baseHref);
    await this.fileService.ensureDirectoryExists(filename);
    return this.fileService.writeFile(str, filename);
  }
}
