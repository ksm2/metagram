import { ModelElement } from '../models/uml/ModelElement';
import { DiagramElement } from './DiagramElement';
import { Canvas } from '../canvas/Canvas';
import { Handle } from './Handle';
import { Stroke } from './Stroke';
import { Font } from './Font';
import { Class, Attribute } from '../decorators/index';
import { Shape } from './Shape';
import { Point } from './Point';
import { BresenhamService } from '../services/BresenhamService';
import { Line } from './Line';

@Class('Edge', DiagramElement)
export abstract class Edge<M extends ModelElement> extends DiagramElement<M> {
  private _stroke: Stroke = new Stroke();
  private _font: Font = new Font();
  private _source: Shape<any>;
  private _target: Shape<any>;
  private _waypoint: Point[] = [];
  private _label: string | null = null;
  private _sourceLabel: string | null = null;
  private _targetLabel: string | null = null;

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

  @Attribute({ type: Shape })
  get source(): Shape<any> {
    return this._source;
  }

  set source(value: Shape<any>) {
    this._source = value;
  }

  @Attribute({ type: Shape })
  get target(): Shape<any> {
    return this._target;
  }

  set target(value: Shape<any>) {
    this._target = value;
  }

  @Attribute({ type: Point, lower: 0, upper: Infinity })
  get waypoint(): Point[] {
    return this._waypoint;
  }

  set waypoint(value: Point[]) {
    this._waypoint = value;
  }

  @Attribute({ type: String, lower: 0 })
  get label(): string | null {
    return this._label;
  }

  set label(value: string | null) {
    this._label = value;
  }

  @Attribute({ type: String, lower: 0 })
  get sourceLabel(): string | null {
    return this._sourceLabel;
  }

  set sourceLabel(value: string | null) {
    this._sourceLabel = value;
  }

  @Attribute({ type: String, lower: 0 })
  get targetLabel(): string | null {
    return this._targetLabel;
  }

  set targetLabel(value: string | null) {
    this._targetLabel = value;
  }

  constructor() {
    super();
    this.handles.push(new Handle());
    this.handles.push(new Handle());
  }

  containsPoint(canvas: Canvas, x: number, y: number): boolean {
    const bresenham = new BresenhamService();
    const lines = bresenham.waylines(canvas, this);

    const { ctx } = canvas;
    ctx.save();
    ctx.lineWidth = Math.max(6, this.stroke.width);
    ctx.beginPath();
    let first = true;
    for (let line of lines) {
      if (first) {
        ctx.moveTo(line.from.x, line.from.y);
        first = false;
      }
      ctx.lineTo(line.to.x, line.to.y);
    }
    ctx.closePath();
    const r = ctx.isPointInStroke(x, y);
    ctx.restore();

    return r;
  }

  render(canvas: Canvas): void {
    const bresenham = new BresenhamService();
    const lines = bresenham.waylines(canvas, this);

    const lastIndex = lines.length - 1;
    for (let i = 0; i <= lastIndex; i += 1) {
      const line = lines[i];
      this.renderLineSegment(canvas, line, i, i === lastIndex);
    }

    // this.handles[0].x = l.x1 || 0;
    // this.handles[0].y = l.y1 || 0;
    // this.handles[1].x = l.x2 || 0;
    // this.handles[1].y = l.y2 || 0;
  }

  protected abstract renderLineSegment(canvas: Canvas, line: Line, index: number, isLastSegment: boolean): void;
}
