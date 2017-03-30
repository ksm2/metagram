import path = require('path');
import chalk = require('chalk');
import { Result } from 'meow';
import { Command } from './Command';
import { XMIDecoder } from '../serialization/encoding/XMIDecoder';
import { Renderer } from '../Renderer';
import { IOService } from '../services/IOService';

export class HTMLDocCommand extends Command {
  constructor(private decoder: XMIDecoder, private ioService: IOService) {
    super('html-doc', '[--base-href] [-o <dir>] URL...', 'Generates an HTML documentation out of a model.');
    this.addOption({ name: '--base-href', description: 'The base HRef to set in the HTML\'s <head>.' });
    this.addOption({ name: '--output-dir', description: 'Specifies the output directory.', shorthand: '-o' });
  }

  async run(result: Result): Promise<void> {
    const outputDir = path.normalize(result.flags['outputDir'] || result.flags['o'] || '.');
    console.info(`Setting output dir to ${chalk.cyan(outputDir)}`);
    const baseHref = result.flags['baseHref'] || '/';
    console.info(`Setting base href to ${chalk.cyan(baseHref)}`);

    const urls = result.input;
    const xmi = await this.decoder.loadURLs(...urls);

    if (!xmi) throw new Error('No XMI source URLs specified');

    const renderer = new Renderer(this.decoder, this.ioService, baseHref, outputDir);

    await renderer.render(xmi);
    await renderer.copyAssets();
    await renderer.renderOverview();

    // Finish terminal
    this.decoder.printErrors();
  }
}
