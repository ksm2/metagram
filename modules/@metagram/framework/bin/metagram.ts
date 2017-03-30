#!/usr/bin/env node
import { CLIApplication } from '../cli/CLIApplication';
import { IOService } from '../services/IOService';

const fileService = new IOService();
const cli = new CLIApplication(fileService);

process.on('unhandledRejection', (err: Error) => {
  cli.showHelp(err);
});

process.nextTick(() => cli.run());
