import path = require('path');
import chalk = require('chalk');
import { Result } from 'meow';
import { TypeScriptBundler } from '../codegen/ts/TypeScriptBundler';
import { XMIDecoder } from '../serialization/encoding/XMIDecoder';
import { IOService } from '../services/IOService';
import { Command } from './Command';

export class TypeScriptCommand extends Command {
  constructor(private decoder: XMIDecoder, private ioService: IOService) {
    super('typescript', '[-o <dir>] [--internal] URL...', 'Generates TypeScript code out of a model.');
    this.addOption({ name: '--output-dir', description: 'Specifies the output directory.', shorthand: '-o' });
    this.addOption({ name: '--internal', description: 'Sets internal mode, which makes Metagram references relative.' });
  }

  async run(result: Result): Promise<void> {
    const urls = result.input;
    if (!urls.length) throw new Error('No XMI source URLs specified');

    const outputDir = path.normalize(result.flags.outputDir || result.flags.o || '.');
    process.stderr.write(`Setting output dir to ${chalk.cyan(outputDir)}\n`);
    const internal = !!result.flags.internal;
    if (internal) process.stderr.write(`Using ${chalk.cyan('internal')} mode\n`);

    // Load models
    const xmi = await this.decoder.loadURLs(...urls);
    if (!xmi) throw new Error('Error while loading models');

    // Bundle TypeScript code into output directory
    const bundler = new TypeScriptBundler(this.ioService);
    await bundler.bundle(xmi, outputDir, { internal });

    // Finish terminal
    this.decoder.printErrors();
  }
}
