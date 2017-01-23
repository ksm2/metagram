import { FileService } from './FileService';
import { XMI, DataType, Class, Package, Enumeration, EnumerationLiteral, Property, PrimitiveType } from './models';
import { cssClass } from './views/html/helpers';

import associationRenderer from './views/html/association.html';
import dataTypeRenderer from './views/html/dataType.html';
import enumerationRenderer from './views/html/enumeration.html';
import enumerationLiteralRenderer from './views/html/enumerationLiteral.html';
import indexRenderer from './views/html/index.html';
import classRenderer from './views/html/class.html';
import packageRenderer from './views/html/package.html';
import propertyRenderer from './views/html/property.html';
import primitiveTypeRenderer from './views/html/primitiveType.html';
import { Association } from './models/Association';
import { ModelElement } from './models/ModelElement';

export class Renderer {
  private rendered: Set<ModelElement>;

  constructor(
    private fileService: FileService,
    private baseHref: string,
    private outputDir: string,
  ) {
    this.rendered = new Set();
  }

  /**
   * Renders many elements sequentially
   */
  async renderAll(elements: ModelElement[]): Promise<void> {
    for (let element of elements) {
      await this.render(element);
    }
  }

  /**
   * Renders any kind of element
   */
  async render(element: ModelElement): Promise<void> {
    if (this.rendered.has(element)) return;
    this.rendered.add(element);

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
    } else if (element instanceof DataType) {
      await this.renderDataType(element);
    } else if (element instanceof Association) {
      await this.renderAssociation(element);
    } else if (element instanceof XMI) {
      await this.renderIndex(element);
    }
  }

  async copyAssets(): Promise<void> {
    await this.fileService.copyDirectory(__dirname + '/../public', this.outputDir);
  }

  async renderIndex(model: XMI): Promise<void>  {
    await this.writeOut(model, `${this.outputDir}/index.html`, indexRenderer).catch(e => { throw e });
  }

  async renderClass(model: Class): Promise<void>  {
    await this.writeOut(model, `${this.outputDir}/${this.generateFilename(model)}`, classRenderer).catch(e => { throw e });
  }

  async renderPackage(model: Package): Promise<void>  {
    await this.writeOut(model, `${this.outputDir}/${this.generateFilename(model)}`, packageRenderer).catch(e => { throw e });
  }

  async renderEnumeration(model: Enumeration): Promise<void>  {
    await this.writeOut(model, `${this.outputDir}/${this.generateFilename(model)}`, enumerationRenderer).catch(e => { throw e });
  }

  async renderEnumerationLiteral(model: EnumerationLiteral): Promise<void>  {
    await this.writeOut(model, `${this.outputDir}/${this.generateFilename(model)}`, enumerationLiteralRenderer).catch(e => { throw e });
  }

  async renderProperty(model: Property): Promise<void>  {
    await this.writeOut(model, `${this.outputDir}/${this.generateFilename(model)}`, propertyRenderer).catch(e => { throw e });
  }

  async renderPrimitiveType(model: PrimitiveType): Promise<void>  {
    await this.writeOut(model, `${this.outputDir}/${this.generateFilename(model)}`, primitiveTypeRenderer).catch(e => { throw e });
  }

  async renderDataType(model: DataType): Promise<void>  {
    await this.writeOut(model, `${this.outputDir}/${this.generateFilename(model)}`, dataTypeRenderer).catch(e => { throw e });
  }

  async renderAssociation(model: Association): Promise<void>  {
    await this.writeOut(model, `${this.outputDir}/${this.generateFilename(model)}`, associationRenderer).catch(e => { throw e });
  }

  async writeOut<T>(model: T, fn: string, renderer: (t: T, b: string, ref: (model: ModelElement) => string) => string): Promise<void> {
    const promises: Promise<void>[] = [];
    const str = renderer(model, this.baseHref, (model: ModelElement) => {
      promises.push(this.render(model));
      return this.generateFilename(model);
    });
    await Promise.all(promises);
    await this.fileService.ensureDirectoryExists(fn);
    return this.fileService.writeFile(str, fn);
  }


  private generateFilename(model: ModelElement): string {
    const paths = model.allOwningElements().map(el => el.name).filter(el => !!el);
    if (model.name) {
      paths.push(`${model.name}.html`);
    } else {
      paths.push(`${cssClass(model)}.html`);
    }

    return paths.join('/');
  }
}
