import { Shape } from './Shape';
import { Point } from './Point';
import { Element } from '@metagram/models';
import { Bounds } from './Bounds';

export class Connector extends Element {
  private _location: Point = new Point();
  private _shape: Shape<any> | null = null;
  private _listener?: Function;

  get location(): Point {
    return this._location;
  }

  set location(value: Point) {
    this._location = value;
    this.emit('location', value);
  }

  get shape(): Shape<any> | null {
    return this._shape;
  }

  set shape(value: Shape<any> | null) {
    if (this._listener && this._shape) this._shape.removeListener('resize', this._listener);
    this._shape = value;
    this.emit('shape', value);
    if (value) {
      this._listener = this.onShapeResize.bind(this);
      value.addListener('resize', this._listener!);
      this.location = new Point(value.bounds.width / 2, value.bounds.height / 2);
    }
  }

  /**
   * Returns the absolute location of this point
   */
  get absoluteLocation(): Point {
    if (!this._shape) return this._location;
    return this._location.add(this._shape.bounds.x, this._shape.bounds.y);
  }

  set absoluteLocation(location: Point) {
    if (!this._shape) {
      this.location = location;
      return;
    }
    this.location = location.add(-this._shape.bounds.x, -this._shape.bounds.y);
  }

  private onShapeResize(newBounds: Bounds, oldBounds: Bounds) {
    this.location = this.location
      .divide(oldBounds.width, oldBounds.height)
      .multiply(newBounds.width, newBounds.height);
  }
}
