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
import { LineStroke } from './LineStroke';

@Class('Edge', DiagramElement)
export abstract class Edge<M extends ModelElement> extends DiagramElement<M> {
  private _stroke: Stroke = new Stroke();
  private _font: Font = new Font();
  private _source: Shape<any> | Point;
  private _target: Shape<any> | Point;
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
  get source(): Shape<any> | Point {
    return this._source;
  }

  set source(value: Shape<any> | Point) {
    this._source = value;
  }

  @Attribute({ type: Shape })
  get target(): Shape<any> | Point {
    return this._target;
  }

  set target(value: Shape<any> | Point) {
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

  containsPoint(px: number, py: number): boolean {
    return this.waylines.calculateDistanceToPoint(new Point(px, py)) < 10;
  }

  render(canvas: Canvas): void {
    const lines = this.waylines.lines;

    const lastIndex = lines.length - 1;
    for (let i = 0; i <= lastIndex; i += 1) {
      const line = lines[i];
      this.renderLineSegment(canvas, line, i, lastIndex);
    }
  }

  createHandles(canvas: Canvas): Handle[] {
    const lines = this.waylines;

    const sourceHandle = new Handle(this, lines.from);
    sourceHandle.on('move', (p: Point) => {
      this._source = p;
    });

    const handles = [sourceHandle];
    for (let point of this._waypoint) {
      const handle = new Handle(this, point);
      handle.on('move', (p: Point) => {
        point.x = p.x;
        point.y = p.y;
      });

      handles.push(handle);
    }

    const targetHandle = new Handle(this, lines.to);
    targetHandle.on('move', (p: Point) => {
      this._target = p;
    });
    handles.push(targetHandle);

    return handles;
  }

  get svgPath(): string {
    return this.waylines.svgPath;
  }

  set svgPath(value: string) {
    this.waylines = LineStroke.fromSVGPath(value);
  }

  get waylines(): LineStroke {
    const bresenham = new BresenhamService();
    return bresenham.waylines(this);
  }

  set waylines(lines: LineStroke) {
    this._waypoint = [];
    this._source = lines.lines[0].from;
    this._target = lines.lines[0].to;
    for (let line of lines.lines.slice(1)) {
      this._waypoint.push(line.from);
      this._target = line.to;
    }
  }

  protected abstract renderLineSegment(canvas: Canvas, line: Line, index: number, lastIndex: number): void;
}
