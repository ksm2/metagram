import { ModelElement } from '../models/ModelElement';
import { DiagramElement } from './DiagramElement';
import { Line } from '../rendering/Geometry';
import { Canvas } from '../canvas/Canvas';
import { Handle } from './Handle';
import { Stroke } from './Stroke';
import { Font } from './Font';
import { Class, Attribute } from '../decorators/index';
import { Shape } from './Shape';
import { bresenhamAlgorithm } from '../rendering/bresenhamAlgorithm';

@Class('Edge', DiagramElement)
export abstract class Edge<M extends ModelElement> extends DiagramElement<M> {
  private _stroke: Stroke = new Stroke();
  private _font: Font = Font.DEFAULT;
  private _source: Shape<any>;
  private _target: Shape<any>;

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

  constructor() {
    super();
    this.handles.push(new Handle());
    this.handles.push(new Handle());
  }

  containsPoint(canvas: Canvas, x: number, y: number): boolean {
    const l = this.connect(canvas);
    const { ctx } = canvas;
    ctx.save();
    ctx.lineWidth = Math.max(6, this.stroke.width);
    ctx.beginPath();
    ctx.moveTo(l.x1 || 0, l.y1 || 0);
    ctx.lineTo(l.x2 || 0, l.y2 || 0);
    ctx.closePath();
    const r = ctx.isPointInStroke(x, y);
    ctx.restore();

    return r;
  }

  render(canvas: Canvas): void {
    const l = this.connect(canvas);
    this.handles[0].x = l.x1 || 0;
    this.handles[0].y = l.y1 || 0;
    this.handles[1].x = l.x2 || 0;
    this.handles[1].y = l.y2 || 0;
    this.renderLine(canvas, l);
  }

  protected abstract renderLine(canvas: Canvas, line: Line): void;

  protected connect(canvas: Canvas): Line {
    return bresenhamAlgorithm(canvas, this._source, this._target);
  }
}
