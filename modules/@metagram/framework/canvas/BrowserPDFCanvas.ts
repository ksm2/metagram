import PDF = require('jspdf');
import { Canvas } from './Canvas';
import { Diagram } from '../diagram/Diagram';
import { Point } from '../diagram/Point';
import { Bounds } from '../diagram/Bounds';
import { Fill } from '../diagram/Fill';
import { Stroke } from '../diagram/Stroke';
import { Baseline, Font, TextAlign } from '../diagram/Font';
import { Line } from '../diagram/Line';
import { LineTip } from '../rendering/LineTip';
import { LineHelper } from '../rendering/LineHelper';

export class PDFCanvas implements Canvas {
  private _width: number;
  private _height: number;
  private _pdf: PDF;
  private _diagram: Diagram;
  private _zoom: number;
  private _offsetX: number;
  private _offsetY: number;
  private _ctx: CanvasRenderingContext2D;

  constructor(diagram: Diagram, zoom: number = 1) {
    this._diagram = diagram;
    this._zoom = zoom;
    const dim = diagram.calcAllElementBounds();
    this._width = zoom * dim.width;
    this._height = zoom * dim.height;
    this._offsetX = -dim.x;
    this._offsetY = -dim.y;
    this._pdf = new PDF();
    this._pdf.addPage([this._width, this._height]);
    this._pdf.deletePage(1);
    this._ctx = this._pdf.context2d as any;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get diagram(): Diagram {
    return this._diagram;
  }

  get offsetX(): number {
    return this._offsetX;
  }

  get offsetY(): number {
    return this._offsetY;
  }

  get zoom(): number {
    return this._zoom;
  }

  set zoom(value: number) {
    this._zoom = value;
  }

  toDataURL(): string {
    this._ctx.scale(this._zoom, this._zoom);
    this._ctx.translate(this._offsetX, this._offsetY);
    if (this._diagram) this._diagram.render(this);

    const blob = this._pdf.output();
    return `data:application/pdf;base64,${window.btoa(blob)}`;
  }

  pushCanvasStack(): void {
    this._ctx.save();
  }

  popCanvasStack(): void {
    this._ctx.restore();
  }

  translate(offset: Point): void {
    this._ctx.translate(offset.x, offset.y);
  }

  fillRectangle(bounds: Bounds, fill: Fill): void {
    fill.apply(this._ctx);
    this._ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
  }

  strokeRectangle(bounds: Bounds, stroke: Stroke): void {
    stroke.apply(this._ctx);
    this._ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  }

  drawText(text: string, x: number, y: number, font: Font, maxWidth?: number, hAlign?: TextAlign, vAlign?: Baseline): void {
    font.apply(this._ctx, hAlign, vAlign);
    this._pdf.setFont('helvetica', font.bold ? 'bold' : 'normal');
    this._pdf.setFontSize(3 * font.size);
    y -= 5;
    if (hAlign == 'center') x -= this.measureTextWidth(text, font) / 2;
    this._ctx.fillText(text, x, y);
  }

  measureTextWidth(text: string, font: Font): number {
    return this._ctx.measureText(text).width;
  }

  drawSimpleLine(x1: number, y1: number, x2: number, y2: number, stroke: Stroke): void {
    stroke.apply(this._ctx);
    this._ctx.beginPath();
    this._ctx.moveTo(x1, y1);
    this._ctx.lineTo(x2, y2);
    this._ctx.stroke();
  }

  drawLine(line: Line, stroke: Stroke, targetTip: LineTip, sourceTip: LineTip): void {
    LineHelper.drawLine(this._ctx, line, stroke, targetTip, sourceTip);
  }

  labelLine(line: Line, font: Font, label: string, position: number = 0): void {
    font = font.clone;
    font.family = 'helvetica';
    font.size *= 3;
    LineHelper.labelLine(this._ctx, line, font, label, position, true);
  }
}
