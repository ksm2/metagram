import meow = require('meow');
import chalk = require('chalk');
import { HTMLDocCommand } from './HTMLDocCommand';
import { Command } from './Command';
import { FetchService, IOService, LogService } from '../services';
import { XMIDecoder } from '../serialization/encoding/XMIDecoder';
import { DiagramCommand } from './DiagramCommand';

export class CLIApplication {
  private fetchService: FetchService;
  private logService: LogService;
  private commands: Command[];

  constructor(private ioService: IOService) {
    this.fetchService = new FetchService(ioService);
    this.logService = new LogService();
    const decoder = new XMIDecoder(this.fetchService, this.logService);

    this.commands = [
      new DiagramCommand(decoder),
      new HTMLDocCommand(decoder, ioService),
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
    const cacheDir = result.flags['cacheDir'] || result.flags['c'] || null;
    if (cacheDir) {
      this.fetchService.setCacheDir(cacheDir);
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
metagram ${command.getName()} ${command.getUsageHelp()}

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
