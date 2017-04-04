import path = require('path');
import { expect } from 'chai';
import { execFile } from 'child_process';
import readJson = require('read-package-json');
import chalk = require('chalk');
import sourceMaps = require('source-map-support');

sourceMaps.install();

process.chdir(path.resolve(__dirname));
process.setMaxListeners(0);

describe('CLIApplication', () => {
  let pkg: any;
  let bin: string;

  beforeEach((done) => {
    readJson(path.join(__dirname, '../package.json'), (err, data) => {
      expect(err).to.be.null;
      pkg = data;
      bin = path.join(__dirname, '../', pkg.bin.metagram);
      done();
    });
  });

  after(() => {
    process.emit('cleanup');
  });

  it('should return the version', (done) => {
    execFile('node', [bin, '--version'], (error, stdout) => {
      expect(error).to.be.null;
      expect(stdout.replace(/\r\n|\n/g, '')).to.equal(pkg.version);
      done();
    });
  });

  it('should print the help', (done) => {
    execFile('node', [bin, '--help'], (error, stdout) => {
      expect(error).to.be.not.null;
      expect(stdout).to.include('metagram <command>');
      expect(stdout).to.include('Commands');
      expect(error).to.have.property('code', 2);
      done();
    });
  });

  it('should error when executing wrong command', (done) => {
    execFile('node', [bin, 'wrong', '--help'], (error, stdout, stderr) => {
      expect(error).to.be.not.null;
      expect(chalk.stripColor(stderr.split('\n')[0])).to.equal('Error: Invalid command: wrong');
      expect(error).to.have.property('code', 1);
      done();
    });
  });
});
