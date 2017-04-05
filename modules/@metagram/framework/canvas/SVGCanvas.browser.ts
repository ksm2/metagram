import C2S = require('canvas2svg');
import { Diagram } from '../diagram/Diagram';
import { AbstractCanvas } from './AbstractCanvas';

export class SVGCanvas extends AbstractCanvas {
  _ctx: C2S;

  constructor(diagram: Diagram, zoom: number = 1) {
    const dim = diagram.calcAllElementBounds();
    const ctx = new C2S(zoom * dim.width, zoom * dim.height);
    super(ctx);
    this.moveOffset(-dim.x, -dim.y);
    this.zoom = zoom;
    this.diagram = diagram;
  }

  get width(): number {
    return this._ctx.canvas.width;
  }

  get height(): number {
    return this._ctx.canvas.height;
  }

  toDataURL(): string {
    return 'data:image/svg+xml,' + this._ctx.getSerializedSvg(true);
  }

  resize(width: number, height: number): this {
    return this;
  }
}
