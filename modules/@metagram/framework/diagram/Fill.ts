import { Color } from './Color';
import { Style } from './Style';

export class Fill {
  style: Style = Color.WHITE;

  static fromStyle(style: Style): Fill {
    return Object.assign(new Fill(), { style });
  }

  apply(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.style.toCanvasStyle();
  }

  clone(): Fill {
    const cl = new Fill();
    cl.style = this.style;
    return cl;
  }

  withStyle(style: Style): Fill {
    const cl = this.clone();
    cl.style = style;
    return cl;
  }
}
