import { Line, destructPoint } from './Geometry';
import { Shape } from '../diagram/Shape';
import { Canvas } from '../canvas/Canvas';

export function bresenhamAlgorithm(canvas: Canvas, el1: Shape<any>, el2: Shape<any>): Line {
  const [x1, y1] = destructPoint(el1.center());
  const [x2, y2] = destructPoint(el2.center());

  // Calculate distances
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);

  // Calculate steps
  const sx = x2 > x1 ? 1 : -1;
  const sy = y2 > y1 ? 1 : -1;

  let p1Hit = true;
  let p2Hit = false;
  let lx1: number | undefined, lx2: number | undefined, ly1: number | undefined, ly2: number | undefined;
  let ox: number | undefined, oy: number | undefined;

  for (let x = x1, y = y1, e = dx - dy; x != x2 || y != y2;) {
    if (p1Hit && !el1.containsPoint(canvas, x, y)) {
      lx1 = x;
      ly1 = y;
      p1Hit = false;
    }
    if (!p2Hit && el2.containsPoint(canvas, x, y)) {
      lx2 = ox || x;
      ly2 = oy || y;
      p2Hit = true;
    }
    if (!p1Hit && p2Hit) break;

    // Update x and y
    ox = x;
    oy = y;
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
  return { x1: lx1, x2: lx2, y1: ly1, y2: ly2 };
}
