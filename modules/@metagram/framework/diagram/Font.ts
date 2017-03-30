import { Element } from '../models';
import { Style } from './Style';
import { Color } from './Color';
export type TextAlign = 'left' | 'right' | 'center' | 'start' | 'end';
export type Baseline = 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';

export class Font extends Element {
  private _family: string;
  private _size: number;
  private _style: Style;
  private _bold: boolean;
  private _italic: boolean;

  constructor(family: string = 'Arial', size: number = 16, style: Style = Color.PRINT, bold: boolean = false, italic: boolean = false) {
    super();
    this._family = family;
    this._size = size;
    this._style = style;
    this._bold = bold;
    this._italic = italic;
  }

  get clone(): Font {
    return new Font(this._family, this._size, this._style, this._bold, this._italic);
  }

  get boldFont(): Font {
    return new Font(this._family, this._size, this._style, true, this._italic);
  }

  get style(): Style {
    return this._style;
  }

  set style(value: Style) {
    this._style = value;
    this.emit('style', value);
  }

  get bold(): boolean {
    return this._bold;
  }

  set bold(value: boolean) {
    this._bold = value;
    this.emit('bold', value);
  }

  get italic(): boolean {
    return this._italic;
  }

  set italic(value: boolean) {
    this._italic = value;
    this.emit('italic', value);
  }

  get size(): number {
    return this._size;
  }

  set size(value: number) {
    this._size = value;
    this.emit('size', value);
  }

  get family(): string {
    return this._family;
  }

  set family(value: string) {
    this._family = value;
    this.emit('family', value);
  }

  apply(ctx: CanvasRenderingContext2D, align: TextAlign = 'left', baseline: Baseline = 'middle'): void {
    const { style, italic, bold, size, family } = this;
    ctx.fillStyle = style.toCanvasStyle();
    ctx.textBaseline = baseline;
    ctx.textAlign = align;
    ctx.font = `${italic ? 'italic ' : ''}${bold ? 'bold ' : ''}${size}px ${family}`;
  }
}
