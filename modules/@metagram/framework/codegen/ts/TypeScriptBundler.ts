import path = require('path');

// Other
import { Class, DataType, Element, Enumeration, ModelElement, Package, PrimitiveType } from '../../models';
import { IOService, StringService } from '../../services';

// Codegen
import { Bundler } from '../Bundler';

// Templates
import { ClassTypeScriptTemplate } from './ClassTypeScriptTemplate';
import { EnumerationTypeScriptTemplate } from './EnumerationTypeScriptTemplate';
import { IndexTypeScriptTemplate } from './IndexTypeScriptTemplate';
import { InterfaceTypeScriptTemplate } from './InterfaceTypeScriptTemplate';
import { ModuleTypeScriptTemplate } from './ModuleTypeScriptTemplate';
import { PackageJsonTypeScriptTemplate } from './PackageJsonTypeScriptTemplate';
import { TSConfigTypeScriptTemplate } from './TSConfigTypeScriptTemplate';

export class TypeScriptBundler extends Bundler {
  constructor(ioService: IOService) {
    super(ioService);

    this.addTemplate(new ClassTypeScriptTemplate(this));
    this.addTemplate(new EnumerationTypeScriptTemplate(this));
    this.addTemplate(new ModuleTypeScriptTemplate(this));
    this.addTemplate(new PackageJsonTypeScriptTemplate(this));
    this.addTemplate(new IndexTypeScriptTemplate(this));
    this.addTemplate(new InterfaceTypeScriptTemplate(this));
    this.addTemplate(new TSConfigTypeScriptTemplate(this));
  }

  async bundle(rootElement: Element, outputDir: string, options: any = {}): Promise<void> {
    const rendered = await this.render(rootElement, outputDir, options);
  }

  createReference(ref: ModelElement, from: ModelElement): string {
    let path = '';
    const targetPaths = ref.allOwningElements();
    const sourcePaths = from.allOwningElements();
    for (let i = sourcePaths.length - 1; i >= 0; i -= 1) {
      const element = sourcePaths[i];
      const targetIndex = targetPaths.indexOf(element);

      // Relative path found?
      if (targetIndex >= 0) {
        if (!path) path = './';

        const remainingDirs = targetPaths.slice(targetIndex + 1).map((pkg) => StringService.camelToHyphenCase(pkg.name!));
        remainingDirs.push(ref.name!);

        return `import { ${ref.name} } from '${path}${remainingDirs.join('/')}';`;
      }

      path += '../';
    }

    // Go all the way up
    if (!path) path = './';

    const remainingDirs = targetPaths.map((pkg) => StringService.camelToHyphenCase(pkg.name!));
    remainingDirs.push(ref.name!);

    return `import { ${ref.name} } from '${path}${remainingDirs.join('/')}';`;
  }

  /**
   * Returns the directory of a given package
   *
   * @param pkg The package to get the directory for
   * @return A full path
   */
  getPackageDirectory(pkg: ModelElement | null): string {
    if (!pkg) return 'src';

    return 'src/' + pkg.allOwningElements()
      .concat(pkg)
      .map((el) => StringService.camelToHyphenCase(el.name!))
      .join('/');
  }

  private async render(root: Element, outputDir: string, options: any): Promise<Set<ModelElement>> {
    const rendered = new Set<ModelElement>();

    const queue: Element[] = [root];
    while (queue.length) {
      const element = queue.shift()!;

      // Add to rendered elements
      if (element instanceof ModelElement) {
        if (rendered.has(element)) continue;
        rendered.add(element);
      }

      // Find matching template
      const templates = this.findTemplates(element, options);

      for (const template of templates) {
        const filename = path.join(outputDir, template.generateFilename(element));
        const content = template.render(element, options, (next) => queue.push(next));
        await this.ioService.ensureDirectoryExists(filename);
        await this.ioService.writeFile(content, filename);
      }
    }

    return rendered;
  }
}
