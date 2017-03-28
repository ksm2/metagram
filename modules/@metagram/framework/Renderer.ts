import { Association, ModelElement, Element, XMI, DataType, Class, Package, Enumeration, EnumerationLiteral, Property, PrimitiveType } from '@metagram/models';
import { FileService } from './services/FileService';
import { cssClass } from './renderers/html/helpers';

import overviewRenderer from './renderers/html/overview.html';
import associationRenderer from './renderers/html/association.html';
import dataTypeRenderer from './renderers/html/dataType.html';
import enumerationRenderer from './renderers/html/enumeration.html';
import enumerationLiteralRenderer from './renderers/html/enumerationLiteral.html';
import indexRenderer from './renderers/html/index.html';
import classRenderer from './renderers/html/class.html';
import packageRenderer from './renderers/html/package.html';
import propertyRenderer from './renderers/html/property.html';
import primitiveTypeRenderer from './renderers/html/primitiveType.html';

export class Renderer {
  private rendered: Set<ModelElement>;
  private roots: Set<ModelElement>;

  constructor(
    private fileService: FileService,
    private baseHref: string,
    private outputDir: string,
  ) {
    this.rendered = new Set();
    this.roots = new Set();
  }

  /**
   * Renders any kind of element
   */
  async render(element: Element): Promise<void> {
    if (element instanceof ModelElement) {
      if (this.rendered.has(element)) return;
      this.rendered.add(element);
    }

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

  async renderOverview(): Promise<void>  {
    const fn = `${this.outputDir}/overview.html`;

    const models = this.sortModelElements([...this.rendered].filter(m => m.name));
    const str = overviewRenderer(models, this.baseHref, this.roots, (model: ModelElement) => {
      return this.generateFilename(model);
    });
    await this.fileService.ensureDirectoryExists(fn);
    return this.fileService.writeFile(str, fn);
  }

  async renderIndex(model: XMI): Promise<void>  {
    for (let element of model.contents) {
      if (element instanceof ModelElement) {
        this.roots.add(element);
      }
    }
    await this.writeOut(model, `${this.outputDir}/index.html`, indexRenderer).catch(e => { throw e });
  }

  async renderClass(model: Class): Promise<void>  {
    await this.writeOut(model, `${this.outputDir}/${this.generateFilename(model)}`, classRenderer).catch(e => { throw e });
  }

  async renderPackage(model: Package): Promise<void> {
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

  async writeOut<T>(model: T, fn: string, renderer: (t: T, b: string, roots: Set<ModelElement>, ref: (model: ModelElement) => string) => string): Promise<void> {
    const promises: Promise<void>[] = [];
    const str = renderer(model, this.baseHref, this.roots, (model: ModelElement) => {
      promises.push(this.render(model));
      return this.generateFilename(model);
    });
    await Promise.all(promises);
    await this.fileService.ensureDirectoryExists(fn);
    return this.fileService.writeFile(str, fn);
  }

  private generateFilename(model: Element): string {
    if (!(model instanceof ModelElement)) return 'index.html';

    const paths = model.allOwningElements().map(el => el.name).filter(el => !!el);
    if (model.name) {
      paths.push(`${model.name}.html`);
    } else {
      paths.push(`${cssClass(model)}.html`);
    }

    return paths.join('/');
  }

  /**
   * Sorts model elements
   */
  private sortModelElements(elements: ModelElement[]): ModelElement[] {
    const compare = (str1: string, str2: string) => str1 < str2 ? -1 : str1 > str2 ? 1 : 0;
    const order = ['Class', 'Enumeration', 'DataType', 'PrimitiveType', 'Package'];
    return elements.sort((m1, m2) => {
      const o1 = m1.getInstanceOf() ? order.indexOf(m1.getInstanceOf()!.name!) : -1;
      const o2 = m2.getInstanceOf() ? order.indexOf(m2.getInstanceOf()!.name!) : -1;

      return (o2 - o1) || compare(m1.name!.toLowerCase(), m2.name!.toLowerCase())
    });
  }
}
