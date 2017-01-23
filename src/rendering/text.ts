import { Point } from './Geometry';
import { Font } from '../diagram/Font';

/**
 * Prints a given text within a rectangle using some font properties
 */
export function text(ctx: CanvasRenderingContext2D, text: string, point: Point, font: Font, maxWidth?: number) {
  font.apply(ctx);
  ctx.fillText(text, point.x || 0, point.y || 0, maxWidth);
}
