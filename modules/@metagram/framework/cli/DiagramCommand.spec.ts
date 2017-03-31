import path = require('path');
import fs = require('fs');
import { execFile } from 'child_process';
import { expect } from 'chai';
import readJson = require('read-package-json');
import chalk = require('chalk');
import sourceMaps = require('source-map-support');

sourceMaps.install();

process.chdir(path.resolve(__dirname));
process.setMaxListeners(0);

describe('DiagramCommand', function () {
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

  it('should print the help', (done) => {
    execFile('node', [bin, 'diagram', '--help'], (error, stdout) => {
      expect(error).to.be.not.null;
      expect(stdout).to.include('metagram diagram');
      expect(stdout).to.include('Description');
      expect(stdout).to.include('Options');
      expect(error).to.have.property('code', 2);
      done();
    });
  });

  it('should error when piping no XMI data', (done) => {
    const p = execFile('node', [bin, 'diagram'], (error, stdout, stderr) => {
      expect(error).to.be.not.null;
      expect(chalk.stripColor(stderr).replace(/\r\n|\n/g, '')).to.equal('Unexpected amount of XMI elements: 0 (expected 1)');
      expect(error).to.have.property('code', 1);
      done();
    });

    p.stdin.write(`Hallo\n`);
    p.stdin.end();
  });

  it('should generate SVG image files', (done) => {
    execFile('node', [bin, 'diagram', '-f', 'svg', 'https://ksm2.github.io/xmi/Petrinet/v1.0.0/Petrinet.xmi'], (error, stdout) => {
      expect(error).to.be.null;
      expect(chalk.stripColor(stdout)).to.include('Saved Petrinet elements.svg');
      expect(fs.existsSync('Petrinet elements.svg')).to.be.true;
      done();
    });
  });

  it('should generate PDF image files', (done) => {
    execFile('node', [bin, 'diagram', '-f', 'pdf', 'https://ksm2.github.io/xmi/Petrinet/v1.0.0/Petrinet.xmi'], (error, stdout) => {
      expect(error).to.be.null;
      expect(chalk.stripColor(stdout)).to.include('Saved Petrinet elements.pdf');
      expect(fs.existsSync('Petrinet elements.pdf')).to.be.true;
      done();
    });
  });

  it('should generate PNG image files', (done) => {
    execFile('node', [bin, 'diagram', '-f', 'png', 'https://ksm2.github.io/xmi/Petrinet/v1.0.0/Petrinet.xmi'], (error, stdout) => {
      expect(error).to.be.null;
      expect(chalk.stripColor(stdout)).to.include('Saved Petrinet elements.png');
      expect(fs.existsSync('Petrinet elements.png')).to.be.true;
      done();
    });
  });

  it('should generate JPEG image files', (done) => {
    execFile('node', [bin, 'diagram', '-f', 'jpeg', 'https://ksm2.github.io/xmi/Petrinet/v1.0.0/Petrinet.xmi'], (error, stdout) => {
      expect(error).to.be.null;
      expect(chalk.stripColor(stdout)).to.include('Saved Petrinet elements.jpeg');
      expect(fs.existsSync('Petrinet elements.jpeg')).to.be.true;
      done();
    });
  });
});
