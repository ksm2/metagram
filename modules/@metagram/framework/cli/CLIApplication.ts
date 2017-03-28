import meow = require('meow');
import chalk = require('chalk');
import { HTMLDocCommand } from './HTMLDocCommand';
import { Command } from './Command';
import { FileService } from '../services/FileService';
import { XMIDecoder } from '../serialization/encoding/XMIDecoder';
import { FetchService } from '../services/FetchService';

export class CLIApplication {
  private fetchService: FetchService;
  private commands: Command[];

  constructor(private fileService: FileService) {
    this.fetchService = new FetchService(fileService);
    const decoder = new XMIDecoder(this.fetchService);

    this.commands = [
      new HTMLDocCommand(decoder, fileService),
    ];
  }

  /**
   * Asynchronously runs the application
   */
  async run(): Promise<void> {
    const result = meow({
      help: false,
    });

    if (result.input.length < 1) {
      this.showHelp();
      return;
    }

    const commandName = result.input[0];
    const command = this.commands.find(command => command.getName() === commandName);
    result.input = result.input.slice(1);

    // Command not found?
    if (!command) {
      throw new Error(`Invalid command: ${commandName}`);
    }

    // Wanting command's help?
    if (result.flags['help'] || result.flags['h']) {
      this.showCommandHelp(command);
      return;
    }

    // Specified cache dir?
    if (result.flags['cacheDir']) {
      this.fetchService.setCacheDir(result.flags['cacheDir']);
      console.info(`Setting cache dir to ${chalk.cyan(this.fetchService.getCacheDir() || '')}`);
    }

    // Run the command
    await command.run(result);
  }

  showHelp(err?: Error): void {
    if (err) {
      console.error(chalk.bgRed.white(err.message));
    }

    const commandString = this.generateCommandHelp(this.commands);
    const help = `
metagram <command> <input>
  
${chalk.bold('Commands')}
${commandString} 
    
${chalk.bold('Examples')}
  cat petrinet.xmi | metagram generate html
    `;

    console.log(help);
    process.exit(err ? 1 : 2);
  }

  showCommandHelp(command: Command): void {
    const options = command.getOptions().map((option) => [
      option.name,
      option.shorthand,
      option.description,
    ]);

    const optionStr = this.generateTable(options);
    const help = `
metagram ${command.getName()} <input>

${chalk.bold('Description')}
  ${command.getDescription()}
  
${chalk.bold('Options')}
${optionStr}
    `;

    console.log(help);
    process.exit(2);
  }

  private generateCommandHelp(commands: Command[]): string {
    const table = commands.map(cmd => [
      cmd.getName(),
      cmd.getDescription(),
    ]);

    return this.generateTable(table);
  }

  private generateTable(rows: (string | undefined)[][]): string {
    if (!rows.length) {
      return '';
    }

    const cols = rows[0].length;
    const max: number[] = [];
    const spaces: string[] = [];
    for (let i = 0; i < cols; i += 1) {
      max[i] = rows.reduce((max, cmd) => Math.max((cmd[i] || '').length, max), 0);
      spaces[i] = ' '.repeat(max[i]);
    }

    return rows.map((column) => {
      return '  ' + column
          .map((col, i) => ((col || '') + spaces[i]).substr(0, max[i]))
          .map((col, i) => i + 1 === cols ? col : chalk.yellow(col))
          .join('  ');
    }).join(`\n`);
  }
}
