import { Line, destructLine } from './Geometry';
import { Stroke } from '../diagram/Stroke';
import { Font } from '../diagram/Font';

export enum ArrowTipKind {
  NONE,
  PEAK,
  TRIANGLE,
  TRIANGLE_FILLED,
  DIAMOND,
  DIAMOND_FILLED,
  BALL,
  BALL_FILLED,
  PLUG,
  CROSS,
}

/**
 * Draws a given line with some stroke properties
 */
export function arrow(ctx: CanvasRenderingContext2D, line: Line, stroke: Stroke,
                      arrowEnd?: ArrowTipKind, arrowStart?: ArrowTipKind,
                      label: string | null = null, labelFont?: Font) {
  const [x1, y1, x2, y2] = destructLine(line);
  const angle = Math.atan2(y2 - y1, x2 - x1);

  // Draw the line itself
  ctx.beginPath();
  stroke.apply(ctx);
  ctx.textAlign = 'round';
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  if (arrowEnd) {
    ctx.save();
    ctx.translate(x2, y2);
    ctx.rotate(angle);
    drawArrowTip(ctx, arrowEnd);
    ctx.restore();
  }

  if (arrowStart) {
    ctx.save();
    ctx.translate(x1, y1);
    ctx.rotate(angle + Math.PI);
    drawArrowTip(ctx, arrowStart);
    ctx.restore();
  }

  if (label) {
    ctx.save();
    ctx.translate((x1 + x2)/2, (y1 + y2)/2);
    ctx.rotate(angle);
    ctx.translate(0, -10);
    ctx.textAlign = 'center';
    if (labelFont) labelFont.apply(ctx);
    ctx.fillText(label, 0, 0);
    ctx.restore();
  }
}

function drawArrowTip(ctx: CanvasRenderingContext2D, kind: ArrowTipKind): void {
switch (kind) {
  case ArrowTipKind.PEAK: {
    ctx.beginPath();
    ctx.moveTo(-17, 6);
    ctx.lineTo(0, 0);
    ctx.lineTo(-17, -6);
    ctx.stroke();
    return;
  }
  case ArrowTipKind.PLUG: {
    ctx.beginPath();
    ctx.arc(8, 0, 8, Math.PI/2, 3*Math.PI/2);
    ctx.stroke();
    return;
  }
  case ArrowTipKind.CROSS: {
    ctx.beginPath();
    ctx.moveTo(-12, 6);
    ctx.lineTo(-5, -6);
    ctx.moveTo(-12, -6);
    ctx.lineTo(-5, 6);
    ctx.stroke();
    return;
  }
  case ArrowTipKind.TRIANGLE: return drawTriangleTip(ctx, 'white');
  case ArrowTipKind.TRIANGLE_FILLED: return drawTriangleTip(ctx, ctx.strokeStyle);
  case ArrowTipKind.DIAMOND: return drawDiamondTip(ctx, 'white');
  case ArrowTipKind.DIAMOND_FILLED: return drawDiamondTip(ctx, ctx.strokeStyle);
  case ArrowTipKind.BALL: return drawBallTip(ctx, 'white');
  case ArrowTipKind.BALL_FILLED: return drawBallTip(ctx, ctx.strokeStyle);

  default: return;
}
}

function drawTriangleTip(ctx: CanvasRenderingContext2D, style: any) {
  ctx.beginPath();
  ctx.fillStyle = style;
  ctx.moveTo(-17.32, 10);
  ctx.lineTo(0, 0);
  ctx.lineTo(-17.32, -10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawDiamondTip(ctx: CanvasRenderingContext2D, style: any) {
  ctx.beginPath();
  ctx.fillStyle = style;
  ctx.moveTo(-10, 6);
  ctx.lineTo(0, 0);
  ctx.lineTo(-10, -6);
  ctx.lineTo(-20, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function  drawBallTip(ctx: CanvasRenderingContext2D, style: any) {
  ctx.beginPath();
  ctx.fillStyle = style;
  ctx.arc(-6, 0, 6, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}
