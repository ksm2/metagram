import { Element } from '@metagram/models';
import { Clazz as Class, Attribute } from '@metagram/models';

@Class('Point', Element)
export class Point extends Element {
  private _x: number;
  private _y: number;

  constructor(x: number = 0, y: number = 0) {
    super();
    this._x = x;
    this._y = y;
  }

  @Attribute({ type: Number })
  get x(): number {
    return this._x;
  }

  set x(value: number) {
    this._x = value;
    this.emit('x', value);
  }

  @Attribute({ type: Number })
  get y(): number {
    return this._y;
  }

  set y(value: number) {
    this._y = value;
    this.emit('y', value);
  }

  /**
   * Returns the point as a tuple
   */
  getTuple(): [number, number] {
    return [this._x, this._y];
  }

  /**
   * Divides the point's coordinates by two divisors
   *
   * @param dx Divisor in X direction
   * @param dy Divisor in Y direction
   * @returns A new point instance
   */
  divide(dx: number, dy: number): Point {
    return new Point(this._x / dx, this._y / dy);
  }

  /**
   * Multiplies the point's coordinates by two factors
   *
   * @param fx Factor in X direction
   * @param fy Factor in Y direction
   * @returns A new point instance
   */
  multiply(fx: number, fy: number): Point {
    return new Point(this._x * fx, this._y * fy);
  }

  /**
   * Adds the point's coordinates with two addends
   *
   * @param ax Addend in X direction
   * @param ay Addend in Y direction
   * @returns A new point instance
   */
  add(ax: number, ay: number): Point {
    return new Point(this._x + ax, this._y + ay);
  }
}
