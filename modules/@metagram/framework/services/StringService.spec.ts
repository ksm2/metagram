import { expect } from 'chai';
import { StringService } from './StringService';

describe('StringService', () => {
  it('should lower case the first letter', () => {
    expect(StringService.lowerCaseFirst('Hello')).to.equal('hello');
    expect(StringService.lowerCaseFirst('hello')).to.equal('hello');
    expect(StringService.lowerCaseFirst('HELLO')).to.equal('hELLO');
    expect(StringService.lowerCaseFirst('hELLO')).to.equal('hELLO');
  });

  it('should upper case the first letter', () => {
    expect(StringService.upperCaseFirst('Hello')).to.equal('Hello');
    expect(StringService.upperCaseFirst('hello')).to.equal('Hello');
    expect(StringService.upperCaseFirst('HELLO')).to.equal('HELLO');
    expect(StringService.upperCaseFirst('hELLO')).to.equal('HELLO');
  });

  it('should convert camel to hyphen case', () => {
    expect(StringService.camelToHyphenCase('Hello')).to.equal('hello');
    expect(StringService.camelToHyphenCase('hello')).to.equal('hello');
    expect(StringService.camelToHyphenCase('HelloWorld')).to.equal('hello-world');
    expect(StringService.camelToHyphenCase('helloWorld')).to.equal('hello-world');
    expect(StringService.camelToHyphenCase('HELLO')).to.equal('h-e-l-l-o');
    expect(StringService.camelToHyphenCase('hELLO')).to.equal('h-e-l-l-o');
  });
});
