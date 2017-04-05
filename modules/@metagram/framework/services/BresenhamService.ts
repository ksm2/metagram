import { Connector } from '../diagram/Connector';
import { Edge } from '../diagram/Edge';
import { Line } from '../diagram/Line';
import { LineStroke } from '../diagram/LineStroke';
import { Point } from '../diagram/Point';

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

    return this.bresenhamsLineAlgorithm(p1, p2, touches1, touches2);
  }

  connectPointWithConnector(p1: Point, c2: Connector): Line {
    const p2 = c2.absoluteLocation;
    const touches1 = (x: number, y: number) => false;
    const touches2 = (x: number, y: number) => !!c2.shape && c2.shape.containsPoint(x, y);

    return this.bresenhamsLineAlgorithm(p1, p2, touches1, touches2);
  }

  connectConnectorWithConnector(c1: Connector, c2: Connector): Line {
    const p1 = c1.absoluteLocation;
    const p2 = c2.absoluteLocation;
    const touches1 = (x: number, y: number) => !!c1.shape && c1.shape.containsPoint(x, y);
    const touches2 = (x: number, y: number) => !!c2.shape && c2.shape.containsPoint(x, y);

    return this.bresenhamsLineAlgorithm(p1, p2, touches1, touches2);
  }

  /**
   * Performs Bresenham's Line Algorithm (Bresenham 1965)
   *
   * The algorithm draws a line from p1 to p2, which have an associated shape. The
   * algorithm tries estimates the line which draws the thought line from p1 to p2
   * while never touching their associated shapes.
   *
   * @param p1 The starting point
   * @param p2 The ending point
   * @param touches1 Callback to check if shape 1 is touched by X and Y coordinates
   * @param touches2 Callback to check if shape 2 is touched by X and Y coordinates
   * @returns The line from shape 1 to shape 2
   */
  bresenhamsLineAlgorithm(p1: Point, p2: Point,
                          touches1: (x: number, y: number) => boolean,
                          touches2: (x: number, y: number) => boolean): Line {
    // Destruct point into tuples
    const [x1, y1] = p1.getTuple();
    const [x2, y2] = p2.getTuple();

    // Points are the same?
    if (x1 === x2 && y1 === y2) return new Line(x1, y1, x2, y2);

    // Calculate distances
    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);

    // Calculate steps
    const sx = x2 > x1 ? 1 : -1;
    const sy = y2 > y1 ? 1 : -1;

    // Initialize source coordinates
    let doCheckShape1 = true;
    let sourceX = x1;
    let sourceY = y1;

    // Initialize error and step
    let x = x1, y = y1, e = dx - dy;
    let oldX = x, oldY = y;

    // Calculate min and max bounds to avoid infinite loops
    let [minX, maxX] = [x1, x2];
    if (sx < 0) [minX, maxX] = [maxX, minX];

    let [minY, maxY] = [y1, y2];
    if (sy < 0) [minY, maxY] = [maxY, minY];

    while (minX <= x && maxX >= x && minY <= y && maxY >= y) {
      // Has left shape 1?
      if (doCheckShape1 && !touches1(x, y)) {
        // Set source coordinates
        sourceX = sx > 0 ? x : oldX;
        sourceY = sy > 0 ? y : oldY;
        doCheckShape1 = false;
      }

      // Has entered shape 2?
      if (sourceX && sourceY && touches2(x, y)) {
        // We are done, return line
        const targetX = sx > 0 ? x : oldX;
        const targetY = sy > 0 ? y : oldY;
        return new Line(sourceX, sourceY, targetX, targetY);
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

    // If target was never reached, return a line from
    // estimated source to targeted point
    return new Line(sourceX, sourceY, x2, y2);
  }
}
