import { expect } from 'chai';
import { SVGService } from './SVGService';

describe('The SVG service', () => {
  it('should generate a valid SVG path using “L”', () => {
    const path1 = SVGService.createSVGPath()
      .moveTo(0, 0)
      .lineTo(100, 100)
      .lineTo(200, 200)
      .toString();

    expect(path1).to.equal('M0 0 L100 100 L200 200');
  });

  it('should generate a valid SVG path using “H” and “V”', () => {
    const pathV = SVGService.createSVGPath()
      .moveTo(0, 0)
      .lineTo(0, 100)
      .toString();

    const pathH = SVGService.createSVGPath()
      .moveTo(0, 0)
      .lineTo(100, 0)
      .toString();

    expect(pathV).to.equal('M0 0 V100');
    expect(pathH).to.equal('M0 0 H100');
  });

  it('should understand valid commands', () => {
    const cmds1 = SVGService.parseSVGPathCommands('M0 0 m30 30 L100 100 l50 50 H40 h60 V70 v80 Z');

    expect(cmds1).to.be.an('array');
    expect(cmds1).to.have.lengthOf(9);
    expect(cmds1[0]).to.deep.equal({ cmd: 'M', args: [0, 0] });
    expect(cmds1[1]).to.deep.equal({ cmd: 'm', args: [30, 30] });
    expect(cmds1[2]).to.deep.equal({ cmd: 'L', args: [100, 100] });
    expect(cmds1[3]).to.deep.equal({ cmd: 'l', args: [50, 50] });
    expect(cmds1[4]).to.deep.equal({ cmd: 'H', args: [40] });
    expect(cmds1[5]).to.deep.equal({ cmd: 'h', args: [60] });
    expect(cmds1[6]).to.deep.equal({ cmd: 'V', args: [70] });
    expect(cmds1[7]).to.deep.equal({ cmd: 'v', args: [80] });
    expect(cmds1[8]).to.deep.equal({ cmd: 'Z', args: [] });
  });

  it('should throw an error on invalid commands', () => {
    expect(() => {
      SVGService.parseSVGPathCommands('M0 0 X42');
    }).to.throw(Error);
  });

  it('should throw an error on invalid parameter config', () => {
    expect(() => {
      SVGService.parseSVGPathCommands('M0 L100');
    }).to.throw(Error);
  });
});
