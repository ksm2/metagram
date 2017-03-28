import path = require('path');
import { exec, execFile } from 'child_process';
import { expect } from 'chai';
import readJson = require('read-package-json');
import chalk = require('chalk');

process.chdir(path.resolve(__dirname));
process.setMaxListeners(0);

describe('CLIApplication', function () {
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

  after(function () {
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
      expect(stdout).to.include('metagram');
      expect(stdout).to.include('Commands');
      expect(stdout).to.include('Examples');
      expect(error).to.have.property('code', 2);
      done();
    });
  });

  it('should print the help for html-doc command', (done) => {
    execFile('node', [bin, 'html-doc', '--help'], (error, stdout) => {
      expect(error).to.be.not.null;
      expect(stdout).to.include('metagram html-doc');
      expect(stdout).to.include('Description');
      expect(stdout).to.include('Options');
      expect(error).to.have.property('code', 2);
      done();
    });
  });

  it('should error when executing wrong command', (done) => {
    execFile('node', [bin, 'wrong', '--help'], (error, stdout, stderr) => {
      expect(error).to.be.not.null;
      expect(chalk.stripColor(stderr).replace(/\r\n|\n/g, '')).to.equal('Invalid command: wrong');
      expect(error).to.have.property('code', 1);
      done();
    });
  });

  it('should error when executing html-doc without source', (done) => {
    execFile('node', [bin, 'html-doc'], (error, stdout, stderr) => {
      expect(error).to.be.not.null;
      expect(chalk.stripColor(stderr).replace(/\r\n|\n/g, '')).to.equal('No XMI source URLs specified');
      expect(error).to.have.property('code', 1);
      done();
    });
  });
});