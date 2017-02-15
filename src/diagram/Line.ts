import { Element } from '../models/Element';
import { Class, Attribute } from '../decorators';
import { Point } from './Point';
import { Canvas } from '../canvas/Canvas';
import { Shape } from './Shape';
import { destructPoint } from '../rendering/Geometry';

@Class('Line', Element)
export class Line extends Element {
  private _from = new Point();
  private _to = new Point();

  @Attribute({ type: Point })
  get from(): Point {
    return this._from;
  }

  set from(value: Point) {
    this._from = value;
  }

  @Attribute({ type: Point })
  get to(): Point {
    return this._to;
  }

  set to(value: Point) {
    this._to = value;
  }

  get dx(): number {
    return this._to.x - this._from.x;
  }

  get dy(): number {
    return this._to.y - this._from.y;
  }

  get length(): number {
    return Math.hypot(this.dx, this.dy);
  }

  constructor(x1?: number, y1?: number, x2?: number, y2?: number) {
    super();
    if (typeof x1 == 'number' && typeof y1 == 'number' && typeof x2 == 'number' && typeof y2 == 'number') {
      this._from = new Point(x1, y1);
      this._to = new Point(x2, y2);
    }
  }

  static fromCoordinates({ x1, y1, x2, y2 }: { x1: number, y1: number, x2: number, y2: number }): Line {
    const result = new Line();
    result.from.x = x1;
    result.from.y = y1;
    result.to.x = x2;
    result.to.y = y2;
    return result;
  }

  static fromTwoPoints(p1: Point, p2: Point): Line {
    const result = new Line();
    result.from = p1;
    result.to = p2;
    return result;
  }

  /**
   * Returns the line's coordinates
   */
  getCoordinates(): { x1: number, y1: number, x2: number, y2: number } {
    const [x1, y1] = this._from.getTuple();
    const [x2, y2] = this._to.getTuple();
    return { x1, y1, x2, y2 };
  }

  /**
   * Calculates a point on the line.
   * Offset 0 is the starting point, offset 1 is the ending point.
   *
   * @param offset
   * @param inPixels If true, the offset is given in pixels
   * @returns a new point instance
   */
  calculatePointBetween(offset: number, inPixels: boolean = false): Point {
    const { _from, dx, dy } = this;
    if (inPixels) offset /= this.length;
    return new Point(_from.x + dx * offset, _from.y + dy * offset);
  }
}
