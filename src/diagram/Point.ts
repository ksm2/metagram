import { Element } from '../models/Element';
import { Class, Attribute } from '../decorators';

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
}
