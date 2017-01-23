import { Rectangle } from './Geometry';
import { Fill } from '../diagram/Fill';
import { Stroke } from '../diagram/Stroke';

/**
 * Draws a given rectangle with some stroke and fill properties
 */
export function rect(ctx: CanvasRenderingContext2D, rect: Rectangle, stroke: Stroke, fill: Fill) {
  fillRect(ctx, rect, fill);
  strokeRect(ctx, rect, stroke);
}

/**
 * Strokes a given rectangle with some stroke properties
 */
export function strokeRect(ctx: CanvasRenderingContext2D, rect: Rectangle, stroke: Stroke) {
  ctx.beginPath();
  stroke.apply(ctx);
  const hlw = stroke.width / 2;
  ctx.rect((rect.x || 0) + hlw, (rect.y || 0) + hlw, rect.width - stroke.width, rect.height - stroke.width);
  ctx.stroke();
}

/**
 * Fills a given rectangle with some fill properties
 */
export function fillRect(ctx: CanvasRenderingContext2D, rect: Rectangle, fill: Fill) {
  ctx.beginPath();
  fill.apply(ctx);
  ctx.rect(rect.x || 0, rect.y || 0, rect.width, rect.height);
  ctx.fill();
}