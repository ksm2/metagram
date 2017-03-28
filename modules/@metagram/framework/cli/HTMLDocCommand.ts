import path = require('path');
import chalk = require('chalk');
import { Result } from 'meow';
import { Command } from './Command';
import { XMIDecoder } from '../serialization/encoding/XMIDecoder';
import { Renderer } from '../Renderer';
import { FileService } from '../services/FileService';

export class HTMLDocCommand extends Command {
  constructor(private decoder: XMIDecoder, private fileService: FileService) {
    super('html-doc', 'Generates an HTML documentation out of a model.');
    this.addOption({ name: '--base-href', description: 'The base HRef to set in the HTML\'s <head>.' });
    this.addOption({ name: '--output-dir', description: 'Specify the output directory.' });
  }

  async run(result: Result): Promise<void> {
    const outputDir = path.normalize(result.flags['outputDir'] || '.');
    console.info(`Setting output dir to ${chalk.cyan(outputDir)}`);
    const baseHref = result.flags['baseHref'] || '/';
    console.info(`Setting base href to ${chalk.cyan(baseHref)}`);

    const urls = result.input;
    const xmi = await this.decoder.loadURLs(...urls);
    this.decoder.printErrors();

    if (!xmi) throw new Error('No XMI source URLs specified');

    const renderer = new Renderer(this.fileService, baseHref, outputDir);

    await renderer.render(xmi);
    await renderer.copyAssets();
    await renderer.renderOverview();
  }
}
