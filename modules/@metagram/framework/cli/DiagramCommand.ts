import path = require('path');
import chalk = require('chalk');
import { Result } from 'meow';
import { NodeCanvas } from '../canvas';
import { Diagram } from '../diagram';
import { XMI } from '../models';
import { XMIDecoder } from '../serialization/encoding';
import { Command } from './Command';

export class DiagramCommand extends Command {
  constructor(private decoder: XMIDecoder) {
    super('diagram', '[-f svg|pdf|png|jpeg] [-o <dir>] [URL]', 'Exports a diagram image out of a model.');
    this.addOption({ name: '--format', description: 'Image format of the image to generate.', shorthand: '-f' });
    this.addOption({ name: '--output-dir', description: 'Specifies the output directory.', shorthand: '-o' });
  }

  async run(result: Result): Promise<void> {
    let xmi: XMI;
    if (result.input.length === 1) {
      xmi = await this.decoder.loadURL(result.input[0]);
    } else {
      xmi = await this.decoder.loadStdin();
    }

    const format = result.flags.format || result.flags.f || 'svg';
    this.checkFormat(format);
    process.stderr.write(`Setting file format to ${chalk.cyan(format)}\n`);
    const outputDir = path.normalize(result.flags.outputDir || result.flags.o || '.');
    process.stderr.write(`Setting output directory to ${chalk.cyan(outputDir)}\n`);

    this.decoder.printErrors();

    // Render contents
    const diagrams = xmi.contents;
    const p = [];
    for (const diagram of diagrams) {
      if (!(diagram instanceof Diagram)) continue;

      const canvas = new NodeCanvas(diagram, 1, format);
      const filename = path.join(outputDir, `${diagram.name}.${format}`);
      p.push(canvas.saveToFile(filename).then(() => process.stderr.write(`Saved ${chalk.yellow(filename)}\n`)));
    }

    await Promise.all(p);
  }

  /**
   * Checks the image format given
   */
  private checkFormat(format: string) {
    const supported = ['png', 'jpeg', 'svg', 'pdf'];

    if (supported.indexOf(format) === -1) {
      throw new Error(`Unsupported image format ${format}, supported are ${supported}`);
    }
  }
}
