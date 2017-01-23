import { Element } from '../models/Element';
import { Class, Attribute } from '../decorators';

@Class('Bounds', Element)
export class Bounds extends Element {
  private _x: number = 0;
  private _y: number = 0;
  private _width: number = 300;
  private _height: number = 100;

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

  @Attribute({ type: Number })
  get width(): number {
    return this._width;
  }

  set width(value: number) {
    this._width = value;
  }

  @Attribute({ type: Number })
  get height(): number {
    return this._height;
  }

  set height(value: number) {
    this._height = value;
  }
}
