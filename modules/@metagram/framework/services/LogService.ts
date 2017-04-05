import chalk = require('chalk');
import clc = require('cli-color');

export class LogService {
  private lines: string[] = [];
  private currentLine: number = -1;

  setInfo(key: string, state: string) {
    this.update(key, chalk.gray(this.pad(state)));
  }

  setWarn(key: string, state: string) {
    this.update(key, chalk.yellow(this.pad(state)));
  }

  setSuccess(key: string, state: string) {
    this.update(key, chalk.green(this.pad(state)));
  }

  finish() {
    const move: any = clc.move;
    process.stdout.write(move.lines(this.lines.length - this.currentLine));
    process.stdout.write(`\n`);
  }

  private pad(s: string) {
    const pad = '         ';
    return (s + pad).substr(0, pad.length);
  }

  private update(key: string, state: string) {
    if (this.currentLine === -1) {
      process.stdout.write(`\n${chalk.bold('Resolving models')}\n`);
      this.currentLine = 0;
    }

    const move: any = clc.move;
    const index = this.lines.indexOf(key);
    if (index < 0) {
      process.stdout.write(move.lines(this.lines.length - this.currentLine));
      this.currentLine = this.lines.length + 1;
      this.lines.push(key);
    } else {
      if (index !== this.currentLine) {
        process.stdout.write(move.lines(index - this.currentLine));
      }
      this.currentLine = index + 1;
    }
    process.stdout.write(`${state} ${key}\n`);
  }
}
