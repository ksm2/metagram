import { DiagramElement } from '../diagram';
import { ModelElement } from '../models';
import { Diagram } from '../diagram';
import { Bounds } from '../diagram/Bounds';
import { Point } from '../diagram/Point';
import { Line } from '../diagram/Line';
import { LineHelper } from '../rendering/LineHelper';
import { LineTip } from '../rendering/LineTip';
import { Stroke } from '../diagram/Stroke';
import { Font } from '../diagram/Font';
import { Shape } from '../diagram/Shape';

export interface ResolveFunction<M extends ModelElement> {
  (m: M): DiagramElement<M>;
}

export abstract class Canvas {
  ctx: CanvasRenderingContext2D;

  private _grid: boolean;
  private _gridX: number;
  private _gridY: number;
  private _zoom: number;
  private _offsetX: number;
  private _offsetY: number;
  private _background: string | null;
  private _diagram: Diagram | null;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;

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
    this.ctx.save();
  }

  /**
   * Pops the canvas stack
   */
  popCanvasStack() {
    this.ctx.restore();
  }

  translate(offset: Point) {
    this.ctx.translate(offset.x, offset.y);
  }

  /**
   * Draws a rectangle within the given bounds
   */
  drawRectangle(bounds: Bounds) {
    this.ctx.rect(bounds.x, bounds.y, bounds.width, bounds.height);
  }

  /**
   * Clips the canvas to a rectangle
   */
  clipRectangle(bounds: Bounds) {
    this.drawRectangle(bounds);
    this.ctx.clip();
  }

  drawLine(line: Line, stroke: Stroke, sourceTip: LineTip, targetTip: LineTip) {
    LineHelper.drawLine(this.ctx, line, stroke, sourceTip, targetTip);
  }

  labelLine(line: Line, font: Font, label: string, position: number = 0) {
    LineHelper.labelLine(this.ctx, line, font, label, position);
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
   * Renders the canvas
   */
  protected render(): this {
    this.pushCanvasStack();
    if (this._grid) this.renderGrid();
    this.ctx.scale(this.zoom, this.zoom);
    this.ctx.translate(this._offsetX, this._offsetY);
    if (this._diagram) this._diagram.render(this);
    this.popCanvasStack();
    return this;
  }

  /**
   * Invalidates the canvas by emptying it
   */
  protected invalidate(): void {
    if (this._background) {
      this.ctx.fillStyle = this._background;
      this.ctx.fillRect(0, 0, this.width, this.height);
    } else {
      this.ctx.clearRect(0, 0, this.width, this.height);
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
   * Move the offset point of the canvas
   */
  protected moveOffset(dx: number, dy: number) {
    this._offsetX += dx;
    this._offsetY += dy;
    this.rerender();
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
    const { ctx, width, height } = this;

    // Set grid properties
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';

    // Render vertical lines
    let dx = this._gridX * this._zoom;
    while (dx < 10) dx *= 2;

    const sx = (this._offsetX * this._zoom) % dx;
    for (let x = sx; x < width - 1; x += dx) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Render horizontal lines
    let dy = this._gridY * this._zoom;
    while (dy < 10) dy *= 2;

    const sy = (this._offsetY * this._zoom) % dy;
    for (let y = sy; y < height - 1; y += dy) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();
  }
}
