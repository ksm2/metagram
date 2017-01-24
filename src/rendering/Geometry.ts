import { Line } from '../diagram/Line';

export type Vector = [number, number];

export interface Shape {
}

export interface Point {
  x?: number;
  y?: number;
}

export function vec(l: Line): Vector {
  const { x1, y1, x2, y2 } = l.getCoordinates();
  return [x2 - x1, y2 - y1];
}

export function supportVec(l: Line): Vector {
  const { x1, y1 } = l.getCoordinates();
  return [x1, y1];
}

export function dot(v1: Vector, v2: Vector): number {
  return v1[0] * v2[0] + v1[1] * v2[1];
}

export function normalVec(v: Vector): Vector {
  const [dx, dy] = v;
  const h = Math.hypot(dx, dy);
  return [-dy / h, dx / h];
}

export function hesseDistance(l: Line, p: Point): number {
  const s = supportVec(l);
  const v = vec(l);
  const n = normalVec(v);
  const d = Math.abs(dot(s, n));

  const q = destructPoint(p);
  const r = Math.abs(dot(q, n)) - d;

  const x = q[0] - r * n[0];
  const lambda = (x - s[0]) / v[0];

  if (lambda > 1) return NaN;
  if (lambda < 0) return NaN;

  return Math.abs(r);
}

export interface Rectangle extends Point, Shape {
  width: number;
  height: number;
}

export function destructPoint(p: Point): Vector {
  const { x, y } = p;
  return [x || 0, y || 0];
}
