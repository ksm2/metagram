import { Element } from '../models/Element';
import { Class, Attribute } from '../decorators';

@Class('Point', Element)
export class Point extends Element {
  private _x: number = 0;
  private _y: number = 0;

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

  /**
   * Returns the point as a tuple
   */
  getTuple(): [number, number] {
    return [this._x, this._y];
  }
}
