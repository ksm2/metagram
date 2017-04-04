import path = require('path');
import fs = require('fs');
import mkdirp = require('mkdirp');
import { expect } from 'chai';
import { execFile } from 'child_process';
import readJson = require('read-package-json');
import chalk = require('chalk');
import sourceMaps = require('source-map-support');

sourceMaps.install();

process.chdir(path.resolve(__dirname));
process.setMaxListeners(0);

describe('TypeScriptCommand', () => {
  let pkg: any;
  let bin: string;

  before((done) => {
     mkdirp('typescript-var', (err) => {
       expect(err).to.be.null;
       expect(fs.existsSync('typescript-var')).to.be.true;
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

  after(() => {
    process.emit('cleanup');
  });

  it('should print the help', (done) => {
    execFile('node', [bin, 'typescript', '--help'], (error, stdout) => {
      expect(error).to.be.not.null;
      expect(stdout).to.include('metagram typescript');
      expect(stdout).to.include('Description');
      expect(stdout).to.include('Options');
      expect(error).to.have.property('code', 2);
      done();
    });
  });

  it('should error when executing without source', (done) => {
    execFile('node', [bin, 'typescript'], (error, stdout, stderr) => {
      expect(error).to.be.not.null;
      expect(chalk.stripColor(stderr.split('\n')[0])).to.equal('Error: No XMI source URLs specified');
      expect(error).to.have.property('code', 1);
      done();
    });
  });

  it('should generate a TypeScript module', function(done) {
    this.timeout(60000);
    const primitiveTypes = 'http://www.omg.org/spec/UML/20131001/PrimitiveTypes.xmi';
    const uml = 'http://www.omg.org/spec/UML/20131001/UML.xmi';
    const command = [bin, 'typescript', '-o', 'out', '-c', 'typescript-var', primitiveTypes, uml];
    execFile('node', command, (error) => {
      expect(error).to.be.null;

      // Check cache contents
      expect(fs.existsSync('typescript-var/http---www.omg.org-spec-UML-20131001-PrimitiveTypes.xmi')).to.be.true;
      expect(fs.existsSync('typescript-var/http---www.omg.org-spec-UML-20131001-UML.xmi')).to.be.true;

      // Check HTML doc output
      expect(fs.existsSync('out')).to.be.true;
      expect(fs.existsSync('out/package.json')).to.be.true;
      expect(fs.existsSync('out/tsconfig.json')).to.be.true;
      expect(fs.existsSync('out/src')).to.be.true;
      expect(fs.existsSync('out/src/index.ts')).to.be.true;
      expect(fs.existsSync('out/src/uml')).to.be.true;
      expect(fs.existsSync('out/src/primitive-types')).to.be.true;

      done();
    });
  });
});
