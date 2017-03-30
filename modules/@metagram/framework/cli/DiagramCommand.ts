import path = require('path');
import chalk = require('chalk');
import { Result } from 'meow';
import { Command } from './Command';
import { XMIDecoder } from '../serialization/encoding/XMIDecoder';
import { XMI } from '../models/xmi/XMI';
import { Diagram } from '../diagram/Diagram';
import { NodeCanvas } from '../canvas';

export class DiagramCommand extends Command {
  constructor(private decoder: XMIDecoder) {
    super('diagram', '[-f svg|pdf|png|jpeg] [-o <dir>] [URL]', 'Generates a diagram image out of a model.');
    this.addOption({ name: '--format', description: 'Image format of the image to generate.', shorthand: '-f' });
    this.addOption({ name: '--output-dir', description: 'Specifies the output directory.', shorthand: '-o' });
  }

  async run(result: Result): Promise<void> {
    const format = result.flags['format'] || result.flags['f'] || 'svg';
    this.checkFormat(format);
    console.info(`Setting file format to ${chalk.cyan(format)}`);
    const outputDir = path.normalize(result.flags['outputDir'] || result.flags['o'] || '.');
    console.info(`Setting output directory to ${chalk.cyan(outputDir)}`);

    let xmi: XMI;
    if (result.input.length === 1) {
      xmi = await this.decoder.loadURL(result.input[0]);
    } else {
      xmi = await this.decoder.loadStdin();
    }

    this.decoder.printErrors();

    // Render contents
    const diagrams = xmi.contents;
    const p = [];
    for (let diagram of diagrams) {
      if (!(diagram instanceof Diagram)) continue;

      const canvas = new NodeCanvas(diagram, 1, format);
      const filename = path.join(outputDir, `${diagram.name}.${format}`);
      p.push(canvas.saveToFile(filename).then(() => console.info(`Saved ${chalk.yellow(filename)}`)));
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
