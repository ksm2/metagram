import { DiagramElement } from './DiagramElement';
import { ModelElement } from '../models/uml/ModelElement';
import { Canvas } from '../canvas/Canvas';
import { Point } from './Point';

export class Handle extends DiagramElement<ModelElement> {
  private _attachedTo: Point;

  constructor(owner: DiagramElement<any>, attachedTo: Point) {
    super();
    this.owningElement = owner;
    this._attachedTo = attachedTo;
    this.cursor = 'default';
  }

  get attachedTo(): Point {
    return this._attachedTo;
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
    const { x, y } = this._attachedTo;
    return x - 4.5 <= px && px <= x + 4.5 && y - 4.5 <= py && py <= y + 4.5;
  }

  drawRect(ctx: CanvasRenderingContext2D) {
    const { x, y } = this._attachedTo;
    ctx.beginPath();
    ctx.rect(x - 4.5, y - 4.5, 9, 9);
    ctx.fill();
    ctx.stroke();
  }

  move(dx: number, dy: number): void {
    this._attachedTo.x += dx;
    this._attachedTo.y += dy;
    this.emit('move', this._attachedTo);
  }
}
