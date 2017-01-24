import { Line } from '../diagram/Line';
import { Shape } from '../diagram/Shape';
import { Point } from '../diagram/Point';
import { Edge } from '../diagram/Edge';
import { Canvas } from '../canvas/Canvas';
import { destructPoint } from '../rendering/Geometry';

export class BresenhamService {
  /**
   * Iterates over all lines which are part of an edge
   *
   * @param canvas Where the edge gets painted on
   * @param edge The edge which gets painted
   */
  waylines(canvas: Canvas, edge: Edge<any>): IterableIterator<Line> {
    const service = this;
    return (function* () {
      // No waypoints? Just connect source and target
      if (!edge.waypoint.length) return service.connectShapeWithShape(canvas, edge.source, edge.target);

      // Yield way from source to first waypoint
      yield service.connectShapeWithPoint(canvas, edge.source, edge.waypoint[0]);

      // Yield ways between waypoints
      let i = 0;
      const max = edge.waypoint.length - 1;
      for (; i < max; i += 1) {
        yield Line.fromTwoPoints(edge.waypoint[i - 1], edge.waypoint[i]);
      }

      // Yield way from last waypoint to target
      return service.connectPointWithShape(canvas, edge.waypoint[i], edge.target);
    })();
  }

  connectShapeWithPoint(canvas: Canvas, shape: Shape<any>, point: Point): Line {
    const [x1, y1] = destructPoint(shape.center());
    const [x2, y2] = [point.x, point.y];
    const touches1 = (x: number, y: number) => shape.containsPoint(canvas, x, y);
    const touches2 = (x: number, y: number) => false;

    return this.bresenhamAlgorithm(x1, y1, x2, y2, touches1, touches2);
  }

  connectPointWithShape(canvas: Canvas, point: Point, shape: Shape<any>): Line {
    const [x1, y1] = [point.x, point.y];
    const [x2, y2] = destructPoint(shape.center());
    const touches1 = (x: number, y: number) => false;
    const touches2 = (x: number, y: number) => shape.containsPoint(canvas, x, y);

    return this.bresenhamAlgorithm(x1, y1, x2, y2, touches1, touches2);
  }

  connectShapeWithShape(canvas: Canvas, el1: Shape<any>, el2: Shape<any>): Line {
    const [x1, y1] = destructPoint(el1.center());
    const [x2, y2] = destructPoint(el2.center());
    const touches1 = (x: number, y: number) => el1.containsPoint(canvas, x, y);
    const touches2 = (x: number, y: number) => el2.containsPoint(canvas, x, y);

    return this.bresenhamAlgorithm(x1, y1, x2, y2, touches1, touches2);
  }

  private bresenhamAlgorithm(x1: number, y1: number, x2: number, y2: number, touches1: (x: number, y: number) => boolean, touches2: (x: number, y: number) => boolean): Line {
    const { dx, dy, sx, sy } = this.initBresenham(x2, x1, y2, y1);

    let doCheckShape1 = true;
    let lx1: number = x1;
    let ly1: number = y1;
    let oldX: number | undefined, oldY: number | undefined;

    let x = x1, y = y1, e = dx - dy;
    while (x !== x2 || y !== y2) {
      if (doCheckShape1 && !touches1(x, y)) {
        lx1 = x;
        ly1 = y;
        doCheckShape1 = false;
      }

      if (lx1 && ly1 && touches2(x, y)) {
        const lx2 = oldX || x;
        const ly2 = oldY || y;
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
