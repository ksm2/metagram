import { Result } from 'meow';
import getStdin = require('get-stdin');

export interface CommandOption {
  name: string,
  description: string,
  shorthand?: string,
}

export class Command {
  private options: CommandOption[];

  constructor(private name: string, private description: string) {
    this.options = [];
    this.addOption({ name: '--help', description: 'Shows this help text.', shorthand: '-h' });
    this.addOption({ name: '--cache-dir', description: 'Specifies the cache directory.' });
  }

  /**
   * Returns the command name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Returns the command description
   */
  getDescription(): string {
    return this.description;
  }

  /**
   * Returns the available options
   */
  getOptions(): CommandOption[] {
    return this.options;
  }

  /**
   * Runs the command
   */
  async run(result: Result): Promise<void> {
  }

  /**
   * Adds an available option
   */
  protected addOption(option: CommandOption): void {
    this.options.push(option);
  }

  /**
   * Returns the contents of std-in
   */
  protected async loadStdin(): Promise<string> {
    // Get input file
    const input = await getStdin();
    if (!input) throw new Error('Please specify an input file');

    return input;
  }
}
