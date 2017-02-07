import { Baseline, Font, TextAlign } from '../diagram/Font';

/**
 * Measures the width of a given text using some font properties
 */
export function measureTextWidth(ctx: CanvasRenderingContext2D, text: string, font: Font, align: TextAlign = 'left', baseline: Baseline = 'middle'): number {
  ctx.save();
  font.apply(ctx, align, baseline);
  const { width } = ctx.measureText(text);
  ctx.restore();

  return width;
}
