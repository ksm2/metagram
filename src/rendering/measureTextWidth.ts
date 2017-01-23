import { Font } from '../diagram/Font';

/**
 * Measures the width of a given text using some font properties
 */
export function measureTextWidth(ctx: CanvasRenderingContext2D, text: string, font: Font): number {
  ctx.save();
  font.apply(ctx);
  const { width } = ctx.measureText(text);
  ctx.restore();

  return width;
}
