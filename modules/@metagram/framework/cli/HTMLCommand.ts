import path = require('path');
import chalk = require('chalk');
import { Result } from 'meow';
import { HTMLBundler } from '../codegen/html/HTMLBundler';
import { XMIDecoder } from '../serialization/encoding/XMIDecoder';
import { IOService } from '../services/IOService';
import { Command } from './Command';

export class HTMLCommand extends Command {
  constructor(private decoder: XMIDecoder, private ioService: IOService) {
    super('html', '[--base-href] [-o <dir>] URL...', 'Generates an HTML documentation out of a model.');
    this.addOption({ name: '--base-href', description: 'The base HRef to set in the HTML\'s <head>.' });
    this.addOption({ name: '--output-dir', description: 'Specifies the output directory.', shorthand: '-o' });
  }

  async run(result: Result): Promise<void> {
    const urls = result.input;
    if (!urls.length) throw new Error('No XMI source URLs specified');

    const outputDir = path.normalize(result.flags.outputDir || result.flags.o || '.');
    process.stderr.write(`Setting output dir to ${chalk.cyan(outputDir)}\n`);
    const baseHref = result.flags.baseHref || '/';
    process.stderr.write(`Setting base href to ${chalk.cyan(baseHref)}\n`);

    // Load models
    const xmi = await this.decoder.loadURLs(...urls);
    if (!xmi) throw new Error('Error while loading models');

    // Bundle HTML code into output directory
    const bundler = new HTMLBundler(this.decoder, this.ioService);
    await bundler.bundle(xmi, outputDir, { baseHref });

    // Finish terminal
    this.decoder.printErrors();
  }
}
