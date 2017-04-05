import { Element } from '../models';
import { IOService } from '../services';
import { Template } from './Template';

export class Bundler {
  constructor(private _ioService: IOService, private _templates: Template[] = []) {
  }

  get ioService(): IOService {
    return this._ioService;
  }

  get templates(): Template[] {
    return this._templates;
  }

  /**
   * Adds a template to the templates to process
   */
  addTemplate(template: Template) {
    this._templates.push(template);
  }

  /**
   * Bundles a root element containing a module into an executable
   * source code bundle, which is put in an output directory.
   *
   * @param rootElement The root element containing a source bundle
   * @param outputDir A directory where generated code will be stored
   * @param [options] Some options to pass to the bundler
   * @return Resolves, if the generated code was bundled successfully
   */
  async bundle(rootElement: Element, outputDir: string, options: any = {}): Promise<void> {
  }

  /**
   * Checks whether the bundler is supporting given data
   *
   * @param data The data to check support for
   * @param [options] Some options to pass to the bundler
   * @return True, if this bundler supports given data
   */
  isSupporting(data: any, options: any = {}): boolean {
    return this.findTemplates(data, options).length > 0;
  }

  /**
   * Copies a directory from a given source to a target
   *
   * @param sourceDir The source directory to copy
   * @param targetDir The name of the copy
   * @return Resolves when the copying is finished
   */
  protected async copyDirectory(sourceDir: string, targetDir: string): Promise<void> {
    await this._ioService.copyDirectory(sourceDir, targetDir);
  }

  /**
   * Finds a matching template for data
   */
  protected findTemplate(data: any, options: any): Template | null {
    for (const template of this._templates) {
      if (template.isSupporting(data, options)) {
        return template;
      }
    }

    return null;
  }

  /**
   * Finds a matching template for an element
   */
  protected findTemplates(element: Element, options: any): Template[] {
    return this._templates.filter((template) => template.isSupporting(element, options));
  }
}
