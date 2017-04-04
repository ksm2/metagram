import path = require('path');
import fs = require('fs');
import mkdirp = require('mkdirp');
import { execFile } from 'child_process';
import { expect } from 'chai';
import readJson = require('read-package-json');
import chalk = require('chalk');
import sourceMaps = require('source-map-support');

sourceMaps.install();

process.chdir(path.resolve(__dirname));
process.setMaxListeners(0);

describe('HTMLCommand', function () {
  let pkg: any;
  let bin: string;

  before((done) => {
     mkdirp('html-var', (err) => {
       expect(err).to.be.null;
       expect(fs.existsSync('html-var')).to.be.true;
       done();
     });
  });

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
    execFile('node', [bin, 'html', '--help'], (error, stdout) => {
      expect(error).to.be.not.null;
      expect(stdout).to.include('metagram html');
      expect(stdout).to.include('Description');
      expect(stdout).to.include('Options');
      expect(error).to.have.property('code', 2);
      done();
    });
  });

  it('should error when executing without source', (done) => {
    execFile('node', [bin, 'html'], (error, stdout, stderr) => {
      expect(error).to.be.not.null;
      expect(chalk.stripColor(stderr).replace(/\r\n|\n/g, '')).to.equal('No XMI source URLs specified');
      expect(error).to.have.property('code', 1);
      done();
    });
  });

  it('should generate an HTML documentation', function (done) {
    this.timeout(60000);
    execFile('node', [bin, 'html', '-o', 'out', '--base-href', '/my/base/href/', '-c', 'html-var', 'http://www.omg.org/spec/UML/20131001/PrimitiveTypes.xmi', 'http://www.omg.org/spec/UML/20131001/UML.xmi'], (error, stdout) => {
      expect(error).to.be.null;

      // Check cache contents
      expect(fs.existsSync('html-var/http---www.omg.org-spec-UML-20131001-PrimitiveTypes.xmi')).to.be.true;
      expect(fs.existsSync('html-var/http---www.omg.org-spec-UML-20131001-UML.xmi')).to.be.true;

      // Check HTML doc output
      expect(fs.existsSync('out')).to.be.true;
      expect(fs.existsSync('out/css')).to.be.true;
      expect(fs.existsSync('out/fonts')).to.be.true;
      expect(fs.existsSync('out/js')).to.be.true;
      expect(fs.existsSync('out/PrimitiveTypes')).to.be.true;
      expect(fs.existsSync('out/PrimitiveTypes.html')).to.be.true;
      expect(fs.existsSync('out/UML')).to.be.true;
      expect(fs.existsSync('out/UML.html')).to.be.true;
      expect(fs.existsSync('out/index.html')).to.be.true;
      expect(fs.existsSync('out/overview.html')).to.be.true;

      done();
    });
  });
});
