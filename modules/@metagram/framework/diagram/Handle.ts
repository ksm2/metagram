import { DiagramElement } from './DiagramElement';
import { ModelElement } from '../models';
import { Canvas } from '../canvas/Canvas';
import { Point } from './Point';
import { Bounds } from './Bounds';
import { Fill } from './Fill';
import { Color } from './Color';
import { Stroke } from './Stroke';

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

  get topLeft(): Point {
    return this._attachedTo;
  }

  get bounds(): Bounds {
    const { x, y } = this._attachedTo;
    return new Bounds(x - 5, y - 5, 10, 10);
  }

  render(canvas: Canvas): void {
    const { hovered, bounds } = this;
    canvas.fillRectangle(bounds, Fill.fromStyle(hovered ? Color.YELLOW : Color.WHITE));
    canvas.strokeRectangle(bounds, new Stroke(Color.BLACK, 1));
  }

  containsPoint(px: number, py: number): boolean {
    const { x, y } = this._attachedTo;
    return x - 4.5 <= px && px <= x + 4.5 && y - 4.5 <= py && py <= y + 4.5;
  }

  move(dx: number, dy: number): void {
    this._attachedTo.x += dx;
    this._attachedTo.y += dy;
    this.emit('move', dx, dy);
  }
}
