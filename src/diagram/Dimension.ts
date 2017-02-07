import { Element } from '../models/Element';
import { Class, Attribute } from '../decorators';
import { Bounds } from './Bounds';

@Class('Dimension', Element)
export class Dimension extends Element {
  private _width: number;
  private _height: number;

  constructor(width: number = 300, height: number = 100) {
    super();
    this._width = width;
    this._height = height;
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

  get bounds(): Bounds {
    return new Bounds(0, 0, this._width, this._height);
  }
}
