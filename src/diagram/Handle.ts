import { DiagramElement } from './DiagramElement';
import { ModelElement } from '../models/ModelElement';
import { Canvas } from '../canvas/Canvas';
import { Attribute } from '../decorators/index';

export class Handle extends DiagramElement<ModelElement> {
  private _x: number = 100;
  private _y: number = 100;
  private _onMove: (x: number, y: number) => void;

  constructor() {
    super();
    this.cursor = 'default';
    this.onMove = () => {};
  }

  @Attribute({ type: Number })
  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
  }

  @Attribute({ type: Number })
  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
  }

  @Attribute({ type: Function })
  get onMove(): (x: number, y: number) => void {
    return this._onMove;
  }

  set onMove(value: (x: number, y: number) => void) {
    this._onMove = value;
  }

  render(canvas: Canvas): void {
    const { hovered } = this;
    const { ctx } = canvas;
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.fillStyle = hovered ? 'yellow' : 'white';
    this.drawRect(ctx);
    ctx.restore();
  }

  containsPoint(canvas: Canvas, px: number, py: number): boolean {
    const { x, y } = this;
    return x - 4.5 <= px && px <= x + 4.5 && y - 4.5 <= py && py <= y + 4.5;
  }

  drawRect(ctx: CanvasRenderingContext2D) {
    const { x, y } = this;
    ctx.beginPath();
    ctx.rect(x - 4.5, y - 4.5, 9, 9);
    ctx.fill();
    ctx.stroke();
  }

  move(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
    this.onMove(this.x, this.y);
  }
}
