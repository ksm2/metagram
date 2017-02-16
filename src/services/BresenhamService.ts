import { Line } from '../diagram/Line';
import { Shape } from '../diagram/Shape';
import { Point } from '../diagram/Point';
import { Edge } from '../diagram/Edge';
import { Canvas } from '../canvas/Canvas';
import { destructPoint } from '../rendering/Geometry';
import { LineStroke } from '../diagram/LineStroke';

export class BresenhamService {
  /**
   * Iterates over all lines which are part of an edge Where the edge gets painted on
   * @param edge The edge which gets painted
   */
  waylines(edge: Edge<any>): LineStroke {
    // No waypoints? Just connect source and target
    if (!edge.waypoint.length) return new LineStroke([this.connect(edge.source, edge.target)]);

    // Yield way from source to first waypoint
    const result = [this.connect(edge.source, edge.waypoint[0])];

    // Yield ways between waypoints
    const max = edge.waypoint.length - 1;
    for (let i = 0; i < max; i += 1) {
       result.push(Line.fromTwoPoints(edge.waypoint[i], edge.waypoint[i + 1]));
    }

    // Yield way from last waypoint to target
    result.push(this.connect(edge.waypoint[max], edge.target));
    return new LineStroke(result);
  }

  connect(a1: Shape<any> | Point, a2: Shape<any> | Point): Line {
    if (a1 instanceof Point) {
      if (a2 instanceof Point) {
        return this.connectPointWithPoint(a1, a2);
      } else {
        return this.connectPointWithShape(a1, a2);
      }
    } else {
      if (a2 instanceof Point) {
        return this.connectShapeWithPoint(a1, a2);
      } else {
        return this.connectShapeWithShape(a1, a2);
      }
    }
  }

  connectPointWithPoint(p1: Point, p2: Point): Line {
    const [x1, y1] = [p1.x, p1.y];
    const [x2, y2] = [p2.x, p2.y];

    return new Line(x1, y1, x2, y2);
  }

  connectShapeWithPoint(shape: Shape<any>, point: Point): Line {
    const [x1, y1] = destructPoint(shape.center());
    const [x2, y2] = [point.x, point.y];
    const touches1 = (x: number, y: number) => shape.containsPoint(x, y);
    const touches2 = (x: number, y: number) => false;

    return this.bresenhamAlgorithm(x1, y1, x2, y2, touches1, touches2);
  }

  connectPointWithShape(point: Point, shape: Shape<any>): Line {
    const [x1, y1] = [point.x, point.y];
    const [x2, y2] = destructPoint(shape.center());
    const touches1 = (x: number, y: number) => false;
    const touches2 = (x: number, y: number) => shape.containsPoint(x, y);

    return this.bresenhamAlgorithm(x1, y1, x2, y2, touches1, touches2);
  }

  connectShapeWithShape(el1: Shape<any>, el2: Shape<any>): Line {
    const [x1, y1] = destructPoint(el1.center());
    const [x2, y2] = destructPoint(el2.center());
    const touches1 = (x: number, y: number) => el1.containsPoint(x, y);
    const touches2 = (x: number, y: number) => el2.containsPoint(x, y);

    return this.bresenhamAlgorithm(x1, y1, x2, y2, touches1, touches2);
  }

  private bresenhamAlgorithm(x1: number, y1: number, x2: number, y2: number, touches1: (x: number, y: number) => boolean, touches2: (x: number, y: number) => boolean): Line {
    const { dx, dy, sx, sy } = this.initBresenham(x2, x1, y2, y1);

    let doCheckShape1 = true;
    let lx1: number = x1;
    let ly1: number = y1;

    let x = x1, y = y1, e = dx - dy;
    let oldX = x, oldY = y;

    while (x !== x2 || y !== y2) {
      if (doCheckShape1 && !touches1(x, y)) {
        lx1 = sx > 0 ? x : oldX;
        ly1 = sy > 0 ? y : oldY;
        doCheckShape1 = false;
      }

      if (lx1 && ly1 && touches2(x, y)) {
        const lx2 = sx > 0 ? x : oldX;
        const ly2 = sy > 0 ? y : oldY;
        return Line.fromCoordinates({ x1: lx1, x2: lx2, y1: ly1, y2: ly2 });
      }

      // Update x and y
      oldX = x;
      oldY = y;
      const e2 = 2 * e;
      if (e2 > -dy) {
        e -= dy;
        x += sx;
      }
      if (e2 < dx) {
        e += dx;
        y += sy;
      }
    }

    return Line.fromCoordinates({ x1: lx1, x2: x2, y1: ly1, y2: y2 });
  }

  private initBresenham(x2: number, x1: number, y2: number, y1: number) {
    // Calculate distances
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);

    // Calculate steps
    const sx = x2 > x1 ? 1 : -1;
    const sy = y2 > y1 ? 1 : -1;

    return { dx, dy, sx, sy };
  }
}
