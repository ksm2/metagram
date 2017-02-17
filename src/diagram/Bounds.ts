import { Element } from '../models/Element';
import { Class, Attribute } from '../decorators';
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

  @Attribute({ type: Number })
  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
    this.emit('width', value);
  }

  @Attribute({ type: Number })
  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
    this.emit('height', value);
  }

  get topLeft(): Point {
    return new Point(this._x, this._y);
  }

  get dimension(): Bounds {
    return new Bounds(0, 0, this._width, this._height);
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
