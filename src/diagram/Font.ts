import { Element } from '../models/Element';
import { Style } from './Style';
import { Color } from './Color';
export type TextAlign = 'left' | 'right' | 'center' | 'start' | 'end';
export type Baseline = 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';

export class Font extends Element {
  style: Style = Color.PRINT;
  bold: boolean = false;
  italic: boolean = false;
  size: number = 16;
  family: string = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  align: TextAlign = 'left';
  baseline: Baseline = 'middle';

  static readonly DEFAULT = new Font();

  apply(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.style.toCanvasStyle();
    ctx.textAlign = this.align;
    ctx.textBaseline = this.baseline;
    ctx.font = `${this.italic ? 'italic ' : ''}${this.bold ? 'bold ' : ''}${this.size}px ${this.family}`;
  }

  clone(): Font {
    const cl = new Font();
    cl.style = this.style;
    cl.bold = this.bold;
    cl.italic = this.italic;
    cl.size = this.size;
    cl.family = this.family;
    cl.align = this.align;
    cl.baseline = this.baseline;
    return cl;
  }

  withScale(scale: number): Font {
    const cl = this.clone();
    cl.size *= scale;
    return cl;
  }

  withBold(bold: boolean = true): Font {
    const cl = this.clone();
    cl.bold = bold;
    return cl;
  }

  withAlign(align: TextAlign): Font {
    const cl = this.clone();
    cl.align = align;
    return cl;
  }
}
