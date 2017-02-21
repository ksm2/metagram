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
import { Connector } from './Connector';
import { SVGService } from '../services/SVGService';

@Class('Edge', DiagramElement)
export abstract class Edge<M extends ModelElement> extends DiagramElement<M> {
  private _stroke: Stroke = new Stroke();
  private _font: Font = new Font();
  private _source: Connector;
  private _target: Connector;
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

  @Attribute({ type: Shape, lower: 0 })
  get source(): Shape<any> | null {
    return this._source.shape;
  }

  set source(value: Shape<any> | null) {
    this._source.shape = value;
  }

  @Attribute({ type: Shape, lower: 0 })
  get target(): Shape<any> | null {
    return this._target.shape;
  }

  set target(value: Shape<any> | null) {
    this._target.shape = value;
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

  /**
   * Returns the source connector of this edge
   */
  get sourceConnector(): Connector {
    return this._source;
  }

  /**
   * Returns the target connector of this edge
   */
  get targetConnector(): Connector {
    return this._target;
  }

  constructor() {
    super();
    this._source = new Connector();
    this._source.on('location', () => this.emit('resize'));
    this._target = new Connector();
    this._target.on('location', () => this.emit('resize'));
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
    const sourceHandle = new Handle(this, this._source.absoluteLocation);
    sourceHandle.on('move', (dx: number, dy: number) => {
      this._source.location = this._source.location.add(dx, dy);
    });

    const handles = [sourceHandle];
    for (let point of this._waypoint) {
      handles.push(new Handle(this, point));
    }

    const targetHandle = new Handle(this, this._target.absoluteLocation);
    targetHandle.on('move', (dx: number, dy: number) => {
      this._target.location = this._target.location.add(dx, dy);
    });
    handles.push(targetHandle);

    return handles;
  }

  get svgPath(): string {
    const path = SVGService.createSVGPath();
    path.moveTo(this._source.absoluteLocation.x, this._source.absoluteLocation.y);
    for (let point of this._waypoint) {
      path.lineTo(point.x, point.y);
    }
    path.lineTo(this._target.absoluteLocation.x, this._target.absoluteLocation.y);
    return path.toString();
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
    this._source.absoluteLocation = lines.lines[0].from;
    this._target.absoluteLocation = lines.lines[0].to;
    for (let line of lines.lines.slice(1)) {
      this._waypoint.push(line.from);
      this._target.absoluteLocation = line.to;
    }
  }

  protected abstract renderLineSegment(canvas: Canvas, line: Line, index: number, lastIndex: number): void;
}
