import { ModelElement } from '../models/ModelElement';
import { DiagramElement } from './DiagramElement';
import { Point } from '../rendering/Geometry';
import { Canvas } from '../canvas/Canvas';
import { Directions } from './Directions';
import { Handle } from './Handle';
import { Fill } from './Fill';
import { Stroke } from './Stroke';
import { Font } from './Font';
import { Bounds } from './Bounds';
import { Attribute, Class } from '../decorators/index';

@Class('Shape', DiagramElement)
export abstract class Shape<M extends ModelElement> extends DiagramElement<M> {
  private _fill: Fill = new Fill();
  private _stroke: Stroke = new Stroke();
  private _font: Font = Font.DEFAULT;
  private _bounds: Bounds = new Bounds();

  constructor() {
    super();
    this.updateHandles();
  }

  @Attribute({ type: Fill })
  get fill(): Fill {
    return this._fill;
  }

  set fill(value: Fill) {
    this._fill = value;
  }

  @Attribute({ type: Stroke })
  get stroke(): Stroke {
    return this._stroke;
  }

  set stroke(value: Stroke) {
    this._stroke = value;
  }

  @Attribute({ type: Font })
  get font(): Font {
    return this._font;
  }

  set font(value: Font) {
    this._font = value;
  }

  @Attribute({ type: Bounds })
  get bounds(): Bounds {
    return this._bounds;
  }

  set bounds(value: Bounds) {
    this._bounds = value;
  }

  /**
   * Draws the outline of this solid element
   */
  outline(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
  }

  /**
   * Returns the center point of this element
   */
  center(): Point {
    const x = this.bounds.x + this.bounds.width / 2;
    const y = this.bounds.y + this.bounds.height / 2;
    return { x, y };
  }

  containsPoint(canvas: Canvas, px: number, py: number): boolean {
    const { x, y, width, height } = this.bounds;
    return px >= x && px < x + width && py >= y && py < y + height;
  }

  move(dx: number, dy: number): void {
    this.bounds.x += dx;
    this.bounds.y += dy;
    this.updateHandles();
  }

  updateHandles() {
    for (let d = 0; d < 8; d += 1) {
      const [x, y] = Directions.rect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height, d);
      const onMove = this.handleMoved.bind(this, d);
      const handle = new Handle();
      Object.assign(handle, { x, y, cursor: Directions.cursor(d), onMove });
      this.handles[d] = handle;
    }
  }

  handleMoved(d: number, newX: number, newY: number) {
    const { x, y } = this.bounds;
    if (d >= Directions.SOUTH_WEST && d <= Directions.NORTH_WEST) {
      this.bounds.width += x - newX;
      this.bounds.x = newX;
    }
    if (d === Directions.NORTH_WEST || d === Directions.NORTH || d === Directions.NORTH_EAST) {
      this.bounds.height += y - newY;
      this.bounds.y = newY;
    }
    if (d >= Directions.NORTH_EAST && d <= Directions.SOUTH_EAST) {
      this.bounds.width = newX - x;
    }
    if (d >= Directions.SOUTH_EAST && d <= Directions.SOUTH_WEST) {
      this.bounds.height = newY - y;
    }
    this.updateHandles();
  }
}
