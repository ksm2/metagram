import { Point } from './Geometry';
import { Baseline, Font, TextAlign } from '../diagram/Font';

/**
 * Prints a given text within a rectangle using some font properties
 */
export function text(ctx: CanvasRenderingContext2D, text: string, point: Point, font: Font, maxWidth?: number, align: TextAlign = 'left', baseline: Baseline = 'middle') {
  font.apply(ctx, align, baseline);
  ctx.fillText(text, point.x || 0, point.y || 0, maxWidth);
}
