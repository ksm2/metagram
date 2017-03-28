import { ModelElement } from '../models';
import { DiagramElement } from './DiagramElement';
import { Canvas } from '../canvas/Canvas';
import { Directions } from './Directions';
import { Handle } from './Handle';
import { Fill } from './Fill';
import { Stroke } from './Stroke';
import { Font } from './Font';
import { Bounds } from './Bounds';
import { Class, Attribute } from '../decorators';
import { Point } from './Point';

@Class('Shape', DiagramElement)
export abstract class Shape<M extends ModelElement> extends DiagramElement<M> {
  private _fill: Fill = new Fill();
  private _stroke: Stroke = new Stroke();
  private _font: Font = new Font();
  private _bounds: Bounds = new Bounds();

  constructor() {
    super();
    this._bounds.on('x', (value: number, oldValue: number) => {
      const oldBounds = this._bounds.clone;
      oldBounds.x = oldValue;
      this.emit('resize', this._bounds, oldBounds);
    });
    this._bounds.on('y', (value: number, oldValue: number) => {
      const oldBounds = this._bounds.clone;
      oldBounds.y = oldValue;
      this.emit('resize', this._bounds, oldBounds);
    });
    this._bounds.on('width', (value: number, oldValue: number) => {
      const oldBounds = this._bounds.clone;
      oldBounds.width = oldValue;
      this.emit('resize', this._bounds, oldBounds);
    });
    this._bounds.on('height', (value: number, oldValue: number) => {
      const oldBounds = this._bounds.clone;
      oldBounds.height = oldValue;
      this.emit('resize', this._bounds, oldBounds);
    });
  }

  @Attribute({ type: Fill })
  get fill(): Fill {
    return this._fill;
  }

  @Attribute({ type: Stroke })
  get stroke(): Stroke {
    return this._stroke;
  }

  @Attribute({ type: Font })
  get font(): Font {
    return this._font;
  }

  @Attribute({ type: Bounds })
  get bounds(): Bounds {
    return this._bounds;
  }

  get topLeft(): Point {
    return this._bounds.topLeft;
  }

  /**
   * Render the shape and its children
   */
  render(canvas: Canvas): void {
    canvas.pushCanvasStack();
    canvas.translate(this._bounds.topLeft);
    this.renderContents(canvas);
    for (let child of this.ownedElements) {
      child.render(canvas);
    }
    canvas.popCanvasStack();
  }

  createHandles(canvas: Canvas): Handle[] {
    const handles = [];
    for (let d = 0; d < 8; d += 1) {
      const handlePosition = Directions.rect(this.bounds, d);
      const handle = new Handle(this, handlePosition);
      handle.cursor = Directions.cursor(d);
      handle.on('move', () => {
        this.onHandleMoved(d, handle.attachedTo.x, handle.attachedTo.y);
      });
      handles[d] = handle;
    }

    return handles;
  }

  renderContents(canvas: Canvas): void {
  }

  /**
   * Returns the center point of this element
   */
  center(): Point {
    const x = this.bounds.x + this.bounds.width / 2;
    const y = this.bounds.y + this.bounds.height / 2;
    return new Point(x, y);
  }

  /**
   * @override
   */
  containsPoint(px: number, py: number): boolean {
    const { x, y, width, height } = this.bounds;
    return px >= x && px < x + width && py >= y && py < y + height;
  }

  /**
   * @override
   */
  move(dx: number, dy: number): void {
    this.bounds.x += dx;
    this.bounds.y += dy;
  }

  /**
   * Called when the handle is moved
   *
   * @param d The direction of the handle
   * @param newX Handle's new X coordinate
   * @param newY Handle's new Y coordinate
   */
  private onHandleMoved(d: number, newX: number, newY: number) {
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
  }
}
