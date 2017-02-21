import { Line } from '../diagram/Line';
import { Point } from '../diagram/Point';
import { Edge } from '../diagram/Edge';
import { LineStroke } from '../diagram/LineStroke';
import { Connector } from '../diagram/Connector';

export class BresenhamService {
  /**
   * Iterates over all lines which are part of an edge Where the edge gets painted on
   *
   * @param edge The edge which gets painted
   * @returns A line stroke connecting all the points along the edge
   */
  waylines(edge: Edge<any>): LineStroke {
    // No waypoints? Just connect source and target
    if (!edge.waypoint.length) return new LineStroke([this.connect(edge.sourceConnector, edge.targetConnector)]);

    // Yield way from source to first waypoint
    const result = [this.connect(edge.sourceConnector, edge.waypoint[0])];

    // Yield ways between waypoints
    const max = edge.waypoint.length - 1;
    for (let i = 0; i < max; i += 1) {
       result.push(Line.fromTwoPoints(edge.waypoint[i], edge.waypoint[i + 1]));
    }

    // Yield way from last waypoint to target
    result.push(this.connect(edge.waypoint[max], edge.targetConnector));
    return new LineStroke(result);
  }

  /**
   * Connects to arbitrary elements with each other
   *
   * @param a1 First arbitrary element
   * @param a2 Second arbitrary element
   * @returns A line from the first arbitrary element to the second
   */
  connect(a1: Connector | Point, a2: Connector | Point): Line {
    if (a1 instanceof Point) {
      if (a2 instanceof Point) {
        return this.connectPointWithPoint(a1, a2);
      } else {
        return this.connectPointWithConnector(a1, a2);
      }
    } else {
      if (a2 instanceof Point) {
        return this.connectConnectorWithPoint(a1, a2);
      } else {
        return this.connectConnectorWithConnector(a1, a2);
      }
    }
  }

  connectPointWithPoint(p1: Point, p2: Point): Line {
    return Line.fromTwoPoints(p1, p2);
  }

  connectConnectorWithPoint(c1: Connector, p2: Point): Line {
    const p1 = c1.absoluteLocation;
    const touches1 = (x: number, y: number) => !!c1.shape && c1.shape.containsPoint(x, y);
    const touches2 = (x: number, y: number) => false;

    return this.bresenhamAlgorithm(p1, p2, touches1, touches2);
  }

  connectPointWithConnector(p1: Point, c2: Connector): Line {
    const p2 = c2.absoluteLocation;
    const touches1 = (x: number, y: number) => false;
    const touches2 = (x: number, y: number) => !!c2.shape && c2.shape.containsPoint(x, y);

    return this.bresenhamAlgorithm(p1, p2, touches1, touches2);
  }

  connectConnectorWithConnector(c1: Connector, c2: Connector): Line {
    const p1 = c1.absoluteLocation;
    const p2 = c2.absoluteLocation;
    const touches1 = (x: number, y: number) => !!c1.shape && c1.shape.containsPoint(x, y);
    const touches2 = (x: number, y: number) => !!c2.shape && c2.shape.containsPoint(x, y);

    return this.bresenhamAlgorithm(p1, p2, touches1, touches2);
  }

  /**
   * Performs the bresenham algorithm
   *
   * @param p1 The starting point
   * @param p2 The ending point
   * @param touches1 Callback to check if shape 1 is touched
   * @param touches2 Callback to check if shape 2 is touched
   * @returns The line from shape 1 to shape 2
   */
  private bresenhamAlgorithm(p1: Point, p2: Point, touches1: (x: number, y: number) => boolean, touches2: (x: number, y: number) => boolean): Line {
    const [x1, y1] = p1.getTuple();
    const [x2, y2] = p2.getTuple();

    // Points are the same?
    if (x1 == x2 && y1 == y2) return new Line(x1, y1, x2, y2);

    // Calculate distances
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);

    // Calculate steps
    const sx = x2 > x1 ? 1 : -1;
    const sy = y2 > y1 ? 1 : -1;

    let doCheckShape1 = true;
    let lx1 = x1;
    let ly1 = y1;

    let x = x1, y = y1, e = dx - dy;
    let oldX = x, oldY = y;

    let [minX, maxX] = [x1, x2];
    if (sx < 0) [minX, maxX] = [maxX, minX];

    let [minY, maxY] = [y1, y2];
    if (sy < 0) [minY, maxY] = [maxY, minY];

    while (minX <= x && maxX >= x && minY <= y && maxY >= y) {
      // Has left shape 1?
      if (doCheckShape1 && !touches1(x, y)) {
        lx1 = sx > 0 ? x : oldX;
        ly1 = sy > 0 ? y : oldY;
        doCheckShape1 = false;
      }

      // Has entered shape 2?
      if (lx1 && ly1 && touches2(x, y)) {
        const lx2 = sx > 0 ? x : oldX;
        const ly2 = sy > 0 ? y : oldY;
        return new Line(lx1, ly1, lx2, ly2);
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

    return new Line(lx1, ly1, x2, y2);
  }
}
