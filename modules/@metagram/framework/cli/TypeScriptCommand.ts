import path = require('path');
import chalk = require('chalk');
import { Result } from 'meow';
import { Command } from './Command';
import { XMIDecoder } from '../serialization/encoding/XMIDecoder';
import { IOService } from '../services/IOService';
import { TypeScriptBundler } from '../codegen/ts/TypeScriptBundler';

export class TypeScriptCommand extends Command {
  constructor(private decoder: XMIDecoder, private ioService: IOService) {
    super('typescript', '[-o <dir>] URL...', 'Generates TypeScript code out of a model.');
    this.addOption({ name: '--output-dir', description: 'Specifies the output directory.', shorthand: '-o' });
  }

  async run(result: Result): Promise<void> {
    const outputDir = path.normalize(result.flags['outputDir'] || result.flags['o'] || '.');
    console.info(`Setting output dir to ${chalk.cyan(outputDir)}`);

    const urls = result.input;
    const xmi = await this.decoder.loadURLs(...urls);

    if (!xmi) throw new Error('No XMI source URLs specified');

    // Bundle HTML code into output directory
    const bundler = new TypeScriptBundler(this.ioService);
    await bundler.bundle(xmi, outputDir);

    // Finish terminal
    this.decoder.printErrors();
  }
}
