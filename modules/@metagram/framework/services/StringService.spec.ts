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

  it('should pluralize words correctly', () => {
    expect(StringService.pluralize('house')).to.equal('houses');
    expect(StringService.pluralize('House')).to.equal('Houses');
    expect(StringService.pluralize('mouse')).to.equal('mice');
    expect(StringService.pluralize('reindeer')).to.equal('reindeer');
    expect(StringService.pluralize('information')).to.equal('information');
    expect(StringService.pluralize('datum')).to.equal('data');
    expect(StringService.pluralize('child')).to.equal('children');
    expect(StringService.pluralize('programme')).to.equal('programmes');
    expect(StringService.pluralize('athletics')).to.equal('athletics');
    expect(StringService.pluralize('thesis')).to.equal('theses');
  });

  it('should singularize words correctly', () => {
    expect(StringService.singularize('houses')).to.equal('house');
    expect(StringService.singularize('Houses')).to.equal('House');
    expect(StringService.singularize('mice')).to.equal('mouse');
    expect(StringService.singularize('reindeer')).to.equal('reindeer');
    expect(StringService.singularize('information')).to.equal('information');
    expect(StringService.singularize('data')).to.equal('datum');
    expect(StringService.singularize('children')).to.equal('child');
    expect(StringService.singularize('theses')).to.equal('thesis');
  });
});
