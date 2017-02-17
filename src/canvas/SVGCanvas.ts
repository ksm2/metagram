import C2S = require('canvas2svg');
import { Canvas } from './Canvas';

export class SVGCanvas extends Canvas {
  ctx: C2S;
  private _width: number;
  private _height: number;

  constructor(width: number, height: number) {
    const ctx = new C2S(width, height);
    super(ctx);
    this._height = height;
    this._width = width;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get svg(): string {
    return this.ctx.getSerializedSvg(true);
  }

  resize(width: number, height: number): this {
    return this;
  }
}
