import { Font } from '../diagram/Font';
import { Line } from '../diagram/Line';
import { Stroke } from '../diagram/Stroke';
import { LineTip } from './LineTip';

/**
 * This helper makes it easier to draw lines
 */
export class LineHelper {
  /**
   * Draws a given line
   */
  static drawLine(ctx: CanvasRenderingContext2D, line: Line, stroke: Stroke, targetTip: LineTip , sourceTip: LineTip) {
    const { length } = line;
    let start = 0, end = 0;

    // Create line context
    LineHelper.createLineContext(ctx, line);
    stroke.apply(ctx);

    if (targetTip) {
      ctx.save();
      ctx.translate(length, 0);
      end = LineHelper.drawLineTip(ctx, targetTip);
      ctx.restore();
    }

    if (sourceTip) {
      ctx.save();
      ctx.rotate(Math.PI);
      start = LineHelper.drawLineTip(ctx, sourceTip);
      ctx.restore();
    }

    // Draw the line itself
    ctx.beginPath();
    ctx.moveTo(start, 0);
    ctx.lineTo(length - end, 0);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Labels a given line
   */
  static labelLine(ctx: CanvasRenderingContext2D, line: Line, font: Font, label: string, position: number) {
    const { angle, length } = line;
    const flip = angle > Math.PI / 2 || angle < -Math.PI / 2;
    const textAngle = flip ? Math.PI : 0;

    // Create line context
    LineHelper.createLineContext(ctx, line);
    font.apply(ctx);

    LineHelper.calculateTextPos(ctx, flip, length, position);
    ctx.rotate(textAngle);
    ctx.fillText(label, 0, -10);

    ctx.restore();
  }

  /**
   * Creates a context to move to line space
   */
  private static createLineContext(ctx: CanvasRenderingContext2D, line: Line) {
    const { angle, x1, y1 } = line;
    ctx.save();
    ctx.translate(x1, y1);
    ctx.rotate(angle);
  }

  private static calculateTextPos(ctx: CanvasRenderingContext2D, flip: boolean, length: number, position: number) {
    if (position == 0) {
      ctx.textAlign = 'center';
      ctx.translate(.5 * length, 0);
      return;
    }

    if (position < 0) {
      ctx.textAlign = flip ? 'left' : 'right';
      ctx.translate(length + position, 0);
      return;
    }

    ctx.textAlign = flip ? 'right' : 'left';
    ctx.translate(position, 0);
  }

  /**
   * Draws a line tip on the canvas and returns the tip's width
   */
  private static drawLineTip(ctx: CanvasRenderingContext2D, tip: LineTip): number {
    switch (tip) {
      case LineTip.PEAK: {
        ctx.beginPath();
        ctx.moveTo(-17, 7);
        ctx.lineTo(-2, 0);
        ctx.lineTo(-17, -7);
        ctx.stroke();
        return 4;
      }
      case LineTip.PLUG: {
        ctx.beginPath();
        ctx.arc(8, 0, 8, Math.PI / 2, 3 * Math.PI / 2);
        ctx.stroke();
        return 8;
      }
      case LineTip.CROSS: {
        ctx.beginPath();
        ctx.moveTo(-12, 6);
        ctx.lineTo(-5, -6);
        ctx.moveTo(-12, -6);
        ctx.lineTo(-5, 6);
        ctx.stroke();
        return 0;
      }
      case LineTip.TRIANGLE:
        return LineHelper.drawTriangleTip(ctx, 'white');
      case LineTip.TRIANGLE_FILLED:
        return LineHelper.drawTriangleTip(ctx, ctx.strokeStyle);
      case LineTip.DIAMOND:
        return LineHelper.drawDiamondTip(ctx, 'white');
      case LineTip.DIAMOND_FILLED:
        return LineHelper.drawDiamondTip(ctx, ctx.strokeStyle);
      case LineTip.BALL:
        return LineHelper.drawBallTip(ctx, 'white');
      case LineTip.BALL_FILLED:
        return LineHelper.drawBallTip(ctx, ctx.strokeStyle);
      case LineTip.BALL_PLUS: {
        const l = LineHelper.drawBallTip(ctx, 'white');
        ctx.beginPath();
        ctx.moveTo(-1, 0);
        ctx.lineTo(-17, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-9, -8);
        ctx.lineTo(-9, +8);
        ctx.stroke();
        return l;
      }
      default:
        throw new Error(`Invalid line tip: ${tip}`);
    }
  }

  private static drawTriangleTip(ctx: CanvasRenderingContext2D, style: any): number {
    ctx.beginPath();

    ctx.beginPath();
    ctx.fillStyle = style;
    ctx.moveTo(-18.32, 10);
    ctx.lineTo(-2, 0);
    ctx.lineTo(-18.32, -10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    return 18.32;
  }

  private static drawDiamondTip(ctx: CanvasRenderingContext2D, style: any): number {
    ctx.beginPath();
    ctx.fillStyle = style;
    ctx.moveTo(-13.5, 7);
    ctx.lineTo(-2.5, 0);
    ctx.lineTo(-13.5, -7);
    ctx.lineTo(-24.5, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    return 24;
  }

  private static  drawBallTip(ctx: CanvasRenderingContext2D, style: any): number {
    ctx.beginPath();
    ctx.fillStyle = style;
    ctx.arc(-9, 0, 8, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    return 17;
  }
}
