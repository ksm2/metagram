import path = require('path');

import { ModelElement, Element, DataType, Class, Package, Enumeration, PrimitiveType } from '../models';
import {
  IndexTemplate,
  AssociationTemplate,
  ClassTemplate,
  DataTypeTemplate,
  EnumerationTemplate,
  PackageTemplate,
  DefaultTemplate,
  OverviewTemplate,
} from './html';
import { IOService } from '../services';
import { XMIDecoder } from '../serialization/encoding/XMIDecoder';
import { Template } from './Template';
import { Bundler } from './Bundler';
import { StringService } from '../services/StringService';

export class HTMLBundler extends Bundler {
  instanceOf: WeakMap<ModelElement, ModelElement>;
  private decoder: XMIDecoder;
  private templates: Template[];

  constructor(
    decoder: XMIDecoder,
    ioService: IOService,
  ) {
    super(ioService);
    this.decoder = decoder;
    this.instanceOf = new WeakMap();

    this.templates = [
      new IndexTemplate(this),
      new AssociationTemplate(this),
      new ClassTemplate(this),
      new DataTypeTemplate(this),
      new EnumerationTemplate(this),
      new PackageTemplate(this),
      new DefaultTemplate(this),
    ];
  }

  async bundle(rootElement: Element, outputDir: string, options: any = {}): Promise<void> {
    const roots: Set<ModelElement> = new Set();
    for (let element of rootElement.contents) {
      if (element instanceof ModelElement) {
        roots.add(element);
      }
    }

    const { baseHref } = options;
    const renderOptions = { baseHref, roots };

    const rendered = await this.render(rootElement, outputDir, renderOptions);
    await this.renderOverview(outputDir, rendered, renderOptions);
    await this.copyAssets(outputDir);
  }

  /**
   * Generates a filename for a given element
   *
   * @param element An element to generate the filename for
   * @return The generated filename
   */
  generateFilename(element: Element): string {
    if (!(element instanceof ModelElement)) return 'index.html';

    const paths = element.allOwningElements().map(el => el.name).filter(el => !!el);
    if (element.name) {
      paths.push(`${element.name}.html`);
    } else {
      paths.push(`${this.cssClass(element)}.html`);
    }

    return paths.join('/');
  }

  cssClass(model: Element) {
    return StringService.camelToHyphenCase(model.constructor.name);
  }

  private async render(element: Element, outputDir: string, options: any): Promise<Set<ModelElement>> {
    const rendered = new Set<ModelElement>();

    const queue: Element[] = [element];
    while (queue.length) {
      let element = queue.shift()!;

      // Add to rendered elements
      if (element instanceof ModelElement) {
        if (rendered.has(element)) continue;
        rendered.add(element);
      }

      // Find matching template
      const template = this.findTemplate(element, options);
      if (!template) continue;

      const filename = path.join(outputDir, this.generateFilename(element));
      if (element instanceof ModelElement) {
        const instanceOf = await this.decoder.loadNodeByType(element.getTypeURI()!, element.getTypeName()!);
        this.instanceOf.set(element, instanceOf);
      }

      const str = template.render(element, options, next => queue.push(next));
      await this.getIOService().ensureDirectoryExists(filename);
      await this.getIOService().writeFile(str, filename);
    }

    return rendered;
  }

  private async copyAssets(outputDir: string): Promise<void> {
    await this.copyDirectory(__dirname + '/../../public', outputDir);
  }

  /**
   * Renders an overview page of all models
   */
  private async renderOverview(outputDir: string, rendered: Set<ModelElement>, options: any): Promise<void>  {
    const filename = path.join(outputDir, 'overview.html');
    const models = this.sortModelElements([...rendered].filter(m => m.name));

    const overviewRenderer = new OverviewTemplate(this);
    const str = overviewRenderer.render(models, options, () => {});

    await this.getIOService().ensureDirectoryExists(filename);
    await this.getIOService().writeFile(str, filename);
  }

  /**
   * Finds a matching template for an element
   */
  private findTemplate(element: Element, options: any): Template | null {
    for (let template of this.templates) {
      if (template.isSupporting(element, options)) {
        return template;
      }
    }

    return null;
  }

  /**
   * Sorts model elements
   */
  private sortModelElements(elements: ModelElement[]): ModelElement[] {
    const compare = (str1: string, str2: string) => str1 < str2 ? -1 : str1 > str2 ? 1 : 0;
    const order = ['Class', 'Enumeration', 'DataType', 'PrimitiveType', 'Package'];
    return elements.sort((m1, m2) => {
      const o1 = m1.getTypeName() ? order.indexOf(m1.getTypeName()!) : -1;
      const o2 = m2.getTypeName() ? order.indexOf(m2.getTypeName()!) : -1;

      return (o2 - o1) || compare(m1.name!.toLowerCase(), m2.name!.toLowerCase())
    });
  }
}
