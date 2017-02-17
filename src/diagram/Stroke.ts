import { Element } from '../models/Element';
import { Style } from './Style';
import { Color } from './Color';

export class Stroke extends Element {
  style: Style = Color.BLACK;
  width: number = 2;
  cap: string = 'butt';
  dashOffset: number = 0;

  clone(): Stroke {
    const cl = new Stroke();
    cl.style = this.style;
    cl.width = this.width;
    cl.cap = this.cap;
    cl.dashOffset = this.dashOffset;
    return cl;
  }

  apply(ctx: CanvasRenderingContext2D): void {
    ctx.strokeStyle = this.style.toCanvasStyle();
    ctx.lineWidth = this.width;
    ctx.lineCap = this.cap;
    if (ctx.setLineDash)
      ctx.setLineDash(this.dashOffset === 0 ? [] : [this.dashOffset]);
  }

  withStyle(style: Style) {
    return Object.assign(this.clone(), { style });
  }
}
