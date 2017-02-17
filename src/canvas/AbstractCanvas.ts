import { Canvas } from './Canvas';
import { DiagramElement } from '../diagram';
import { Diagram } from '../diagram';
import { Bounds } from '../diagram/Bounds';
import { Point } from '../diagram/Point';
import { Line } from '../diagram/Line';
import { LineHelper } from '../rendering/LineHelper';
import { LineTip } from '../rendering/LineTip';
import { Stroke } from '../diagram/Stroke';
import { Baseline, Font, TextAlign } from '../diagram/Font';
import { Shape } from '../diagram/Shape';
import { Fill } from '../diagram/Fill';

export abstract class AbstractCanvas implements Canvas {
  protected _ctx: CanvasRenderingContext2D;
  private _grid: boolean;
  private _gridX: number;
  private _gridY: number;
  private _zoom: number;
  private _offsetX: number;
  private _offsetY: number;
  private _background: string | null;
  private _diagram: Diagram | null;

  constructor(ctx: any) {
    this._ctx = ctx;
    this._grid = false;
    this._gridX = 25;
    this._gridY = 25;
    this._diagram = null;
    this._zoom = 1;
    this._offsetX = 0;
    this._offsetY = 0;
    this._background = null;
  }

  set grid(val: boolean) {
    this._grid = val;
    this.rerender();
  }

  get grid(): boolean {
    return this._grid;
  }

  set diagram(val: Diagram | null) {
    this._diagram = val;
    this.rerender();
  }

  get diagram(): Diagram | null {
    return this._diagram;
  }

  get gridX(): number {
    return this._gridX;
  }

  get gridY(): number {
    return this._gridY;
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

  get background(): string | any {
    return this._background;
  }

  set background(value: string | any) {
    this._background = value;
    this.rerender();
  }

  get zoomWidth(): number {
    return this.width / this.zoom;
  }

  get zoomHeight(): number {
    return this.height / this.zoom;
  }

  /**
   * Returns the current width of the canvas
   */
  abstract get width(): number;

  /**
   * Returns the current height of the canvas
   */
  abstract get height(): number;

  /**
   * Pushes the canvas stack
   */
  pushCanvasStack() {
    this._ctx.save();
  }

  /**
   * Pops the canvas stack
   */
  popCanvasStack() {
    this._ctx.restore();
  }

  translate(offset: Point) {
    this._ctx.translate(offset.x, offset.y);
  }

  /**
   * Draws a rectangle within the given bounds
   */
  drawRectangle(bounds: Bounds) {
    this._ctx.rect(bounds.x, bounds.y, bounds.width, bounds.height);
  }

  /**
   * Fills a rectangle
   *
   * @param bounds The rectangle's bounds
   * @param fill The fill to use
   */
  fillRectangle(bounds: Bounds, fill: Fill) {
    fill.apply(this._ctx);
    this._ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
  }

  /**
   * Strokes a rectangle
   *
   * @param bounds The rectangle's outer bounds
   * @param stroke The fill to use
   */
  strokeRectangle(bounds: Bounds, stroke: Stroke) {
    stroke.apply(this._ctx);
    bounds = bounds.inset(stroke.width / 2);
    this._ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  }

  /**
   * Draws a text
   *
   * @param text The text to draw
   * @param x The text X position
   * @param y The text Y position
   * @param font The font to use
   * @param maxWidth The maximum width of the text
   * @param hAlign The horizontal alignment
   * @param vAlign The vertical alignment
   */
  drawText(text: string, x: number, y: number, font: Font, maxWidth?: number, hAlign: TextAlign = 'left', vAlign: Baseline = 'middle') {
    font.apply(this._ctx, hAlign, vAlign);
    this._ctx.fillText(text, x, y, maxWidth);
  }

  /**
   * Measures the width of a text
   *
   * @param text The text to measure
   * @param font The font to use
   * @returns {number}
   */
  measureTextWidth(text: string, font: Font): number {
    this._ctx.save();
    font.apply(this._ctx);
    const { width } = this._ctx.measureText(text);
    this._ctx.restore();

    return width;
  }

  /**
   * Clips the canvas to a rectangle
   */
  clipRectangle(bounds: Bounds) {
    this.drawRectangle(bounds);
    this._ctx.clip();
  }

  /**
   * Draws a simple line from four coordinates
   */
  drawSimpleLine(x1: number, y1: number, x2: number, y2: number, stroke: Stroke) {
    stroke.apply(this._ctx);
    this._ctx.beginPath();
    this._ctx.moveTo(x1, y1);
    this._ctx.lineTo(x2, y2);
    this._ctx.stroke();
  }

  drawLine(line: Line, stroke: Stroke, targetTip: LineTip, sourceTip: LineTip) {
    LineHelper.drawLine(this._ctx, line, stroke, targetTip, sourceTip);
  }

  labelLine(line: Line, font: Font, label: string, position: number = 0) {
    LineHelper.labelLine(this._ctx, line, font, label, position);
  }

  /**
   * Resizes the canvas
   *
   * @param width The new width of the canvas
   * @param height The new height of the canvas
   */
  abstract resize(width: number, height: number): this;

  /**
   * Invalidates and renders the canvas
   */
  rerender(): this {
    this.invalidate();
    return this.render();
  }

  /**
   * Move the offset point of the canvas
   */
  moveOffset(dx: number, dy: number) {
    this._offsetX += dx;
    this._offsetY += dy;
    this.rerender();
  }

  /**
   * Renders the canvas
   */
  protected render(): this {
    this.pushCanvasStack();
    if (this._grid) this.renderGrid();
    this._ctx.scale(this.zoom, this.zoom);
    this._ctx.translate(this._offsetX, this._offsetY);
    if (this._diagram) this._diagram.render(this);
    this.popCanvasStack();
    return this;
  }

  /**
   * Invalidates the canvas by emptying it
   */
  protected invalidate(): void {
    if (this._background) {
      this._ctx.fillStyle = this._background;
      this._ctx.fillRect(0, 0, this.width, this.height);
    } else {
      this._ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  protected zoomCanvas(newZoom: number, x?: number, y?: number) {
    const oldZoom = this._zoom;
    const centerX = x ? x / this._zoom : this.zoomWidth / 2;
    const centerY = y ? y / this._zoom : this.zoomHeight / 2;
    const d = (oldZoom / newZoom - 1);
    this._zoom = newZoom;
    this.moveOffset(centerX * d, centerY * d);
  }

  /**
   * Converts global coordinates to element based coordinates
   */
  protected getElementCoordinates(target: DiagramElement<any>): [number, number] {
    let element: DiagramElement<any> | null = target;
    let x = 0, y = 0;
    do {
      if (element instanceof Shape) {
        x += element.bounds.x;
        y += element.bounds.y;
      }
      element = element.owningElement;
    } while (element);

    return [x, y];
  }

  /**
   * Renders a grid in the background
   */
  private renderGrid(): void {
    const { _ctx, width, height } = this;

    // Set grid properties
    _ctx.save();
    _ctx.lineWidth = 1;
    _ctx.strokeStyle = 'rgba(0,0,0,0.2)';

    // Render vertical lines
    let dx = this._gridX * this._zoom;
    while (dx < 10) dx *= 2;

    const sx = (this._offsetX * this._zoom) % dx;
    for (let x = sx; x < width - 1; x += dx) {
      _ctx.beginPath();
      _ctx.moveTo(x, 0);
      _ctx.lineTo(x, height);
      _ctx.stroke();
    }

    // Render horizontal lines
    let dy = this._gridY * this._zoom;
    while (dy < 10) dy *= 2;

    const sy = (this._offsetY * this._zoom) % dy;
    for (let y = sy; y < height - 1; y += dy) {
      _ctx.beginPath();
      _ctx.moveTo(0, y);
      _ctx.lineTo(width, y);
      _ctx.stroke();
    }
    _ctx.restore();
  }
}
