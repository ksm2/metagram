import { Element } from '../models/Element';
import { IOService } from '../services/IOService';

export class Bundler {
  constructor(private ioService: IOService) {
  }

  getIOService(): IOService {
    return this.ioService;
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

  protected async copyDirectory(sourceDir: string, targetDir: string): Promise<void> {
    await this.ioService.copyDirectory(sourceDir, targetDir);
  }
}
