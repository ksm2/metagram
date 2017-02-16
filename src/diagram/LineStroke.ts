import { Element } from '../models/Element';
import { Class, Attribute } from '../decorators';
import { Line } from './Line';
import { SVGService } from '../services/SVGService';
import { Point } from './Point';

@Class('LineStroke', Element)
export class LineStroke extends Element {
  private _lines: Line[] = [];

  @Attribute({ type: Line, upper: Infinity })
  get lines(): Line[] {
    return this._lines;
  }

  set lines(value: Line[]) {
    this._lines = value;
  }

  get svgPath(): string {
    let x = this._lines[0].from.x, y = this._lines[0].from.y;

    // First segment
    let svg = `M${x} ${y}`;

    // Following segments
    for (let line of this._lines) {
      let nx = line.to.x, ny = line.to.y;
      if (nx === x) {
        svg += ` V${ny}`;
      } else if (ny === y) {
        svg += ` H${nx}`;
      } else {
        svg += ` L${nx} ${ny}`;
      }
      x = nx; y = ny;
    }

    return svg;
  }

  constructor(lines: Line[] = []) {
    super();
    this._lines = lines;
  }

  /**
   * Creates a line stroke from an SVG path command
   */
  static fromSVGPath(path: string): LineStroke {
    const commands = SVGService.parseSVGPathCommands(path);
    if (commands.length < 2) throw new Error(`SVG error: Not enough path commands: ${path}`);
    if (commands[0].cmd !== 'M') throw new Error(`SVG error: Does not start with M command: ${path}`);

    // Work over all lines
    const lines = [];
    let x = commands[0].args[0], y = commands[0].args[1];
    for (let command of commands.slice(1)) {
      let nx, ny;
      switch (command.cmd) {
        case 'L':
          nx = command.args[0];
          ny = command.args[1];
          break;
        case 'l':
          nx = x + command.args[0];
          ny = y + command.args[1];
          break;
        case 'H':
          nx = command.args[0];
          ny = y;
          break;
        case 'h':
          nx = x + command.args[0];
          ny = y;
          break;
        case 'V':
          nx = x;
          ny = command.args[0];
          break;
        case 'v':
          nx = x;
          ny = y + command.args[0];
          break;
        default:
          throw new Error(`SVG error: Unsupported command ${command.cmd}: ${path}`);
      }

      lines.push(new Line(x, y, nx, ny));
      x = nx; y = ny;
    }

    return new LineStroke(lines);
  }

  /**
   * Calculates the distance if a point to this line stroke
   */
  calculateDistanceToPoint(point: Point): number {
    return this._lines.reduce((previous, current) => Math.min(previous, current.calculateDistanceToPoint(point)), Infinity);
  }

  /**
   * Returns the nearest line to a given point
   * @param point The point to look the nearest path for
   * @returns The index of the nearest line
   */
  getNearestLine(point: Point): number {
    const dd = new Map<Line, number>();
    const nearestLines = this._lines.slice().sort((line1, line2) => {
      if (!dd.has(line1)) dd.set(line1, line1.calculateDistanceToPoint(point));
      if (!dd.has(line2)) dd.set(line2, line2.calculateDistanceToPoint(point));

      const d1 = dd.get(line1)!;
      const d2 = dd.get(line2)!;

      return d1 - d2;
    });

    return this._lines.indexOf(nearestLines[0]);
  }
}
