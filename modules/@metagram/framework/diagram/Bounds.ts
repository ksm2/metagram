import { Attribute, Class } from '../decorators';
import { Element } from '../models';
import { Point } from './Point';

@Class('Bounds', Element)
export class Bounds extends Element {
  private _x: number;
  private _y: number;
  private _width: number;
  private _height: number;

  constructor(x: number = 0, y: number = 0, width: number = 300, height: number = 100) {
    super();
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;
  }

  @Attribute({ type: Number })
  get x(): number {
    return this._x;
  }

  set x(value: number) {
    [value, this._x] = [this._x, value];
    this.emit('x', this._x, value);
  }

  @Attribute({ type: Number })
  get y(): number {
    return this._y;
  }

  set y(value: number) {
    [value, this._y] = [this._y, value];
    this.emit('y', this._y, value);
  }

  @Attribute({ type: Number })
  get width(): number {
    return this._width;
  }

  set width(value: number) {
    [value, this._width] = [this._width, value];
    this.emit('width', this._width, value);
  }

  @Attribute({ type: Number })
  get height(): number {
    return this._height;
  }

  set height(value: number) {
    [value, this._height] = [this._height, value];
    this.emit('height', this._height, value);
  }

  get topLeft(): Point {
    return new Point(this._x, this._y);
  }

  /**
   * Returns dimensions of these bounds
   */
  get dimension(): Bounds {
    return new Bounds(0, 0, this._width, this._height);
  }

  /**
   * Returns a clone of these bounds
   */
  get clone(): Bounds {
    return new Bounds(this._x, this._y, this._width, this._height);
  }

  /**
   * Insets the bounds given a length in X and Y direction
   */
  inset(dx: number, dy?: number): Bounds {
    const x = dx;
    const y = dy || dx;
    return new Bounds(this._x + x, this._y + y, this._width - 2 * x, this._height - 2 * y);
  }
}
