import { Bounds } from './Bounds';
import { Cursor } from './Cursor';
import { Point } from './Point';

export class Directions {
  static NORTH = 0;
  static NORTH_EAST = 1;
  static EAST = 2;
  static SOUTH_EAST = 3;
  static SOUTH = 4;
  static SOUTH_WEST = 5;
  static WEST = 6;
  static NORTH_WEST = 7;

  private static xs = [1, 2, 2, 2, 1, 0, 0, 0];
  private static ys = [0, 0, 1, 2, 2, 2, 1, 0];
  private static cursors = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];

  static rect(bounds: Bounds, direction: number): Point {
    const { x, y, width, height } = bounds;
    return new Point(x + width * Directions.xs[direction] / 2, y + height * Directions.ys[direction] / 2);
  }

  static cursor(direction: number): Cursor {
    return `${Directions.cursors[direction]}-resize` as Cursor;
  }
}
