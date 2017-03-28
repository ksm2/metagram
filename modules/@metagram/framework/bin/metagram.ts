#!/usr/bin/env node
import { CLIApplication } from '../cli/CLIApplication';
import { FileService } from '../services/FileService';

const fileService = new FileService();
const cli = new CLIApplication(fileService);

process.on('unhandledRejection', (err: Error) => {
  cli.showHelp(err);
});

process.nextTick(() => cli.run());
