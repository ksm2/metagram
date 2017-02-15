import { DiagramElement } from './DiagramElement';
import { ModelElement } from '../models/uml/ModelElement';
import { Canvas } from '../canvas/Canvas';
import { Attribute } from '../decorators/index';
import { Point } from './Point';

export class Handle extends DiagramElement<ModelElement> {
  private _x: number;
  private _y: number;

  constructor(x: number = 100, y: number = 100) {
    super();
    this._x = x;
    this._y = y;
    this.cursor = 'default';
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

  containsPoint(px: number, py: number): boolean {
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
    this.emit('move', new Point(this.x, this.y));
  }
}
