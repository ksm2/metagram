import { Diagram } from '../diagram';
import { Bounds } from '../diagram/Bounds';
import { Point } from '../diagram/Point';
import { Line } from '../diagram/Line';
import { LineTip } from '../rendering/LineTip';
import { Stroke } from '../diagram/Stroke';
import { Baseline, Font, TextAlign } from '../diagram/Font';
import { Fill } from '../diagram/Fill';

export interface Canvas {
  zoom: number;
  diagram: Diagram | null;
  readonly width: number;
  readonly height: number;
  readonly offsetX: number;
  readonly offsetY: number;

  /**
   * Pushes the canvas stack
   */
  pushCanvasStack(): void;

  /**
   * Pops the canvas stack
   */
  popCanvasStack(): void;

  /**
   * Translates the canvas to a given offset
   */
  translate(offset: Point): void;

  /**
   * Fills a rectangle
   *
   * @param bounds The rectangle's bounds
   * @param fill The fill to use
   */
  fillRectangle(bounds: Bounds, fill: Fill): void;

  /**
   * Strokes a rectangle
   *
   * @param bounds The rectangle's outer bounds
   * @param stroke The fill to use
   */
  strokeRectangle(bounds: Bounds, stroke: Stroke): void;

  /**
   * Draws a text
   *
   * @param text The text to draw
   * @param x The text X position
   * @param y The text Y position
   * @param font The font to use
   * @param maxWidth The maximum width of the text
   * @param hAlign The horizontal alignment
   * @param vAlign The vertical alignment
   */
  drawText(text: string, x: number, y: number, font: Font, maxWidth?: number, hAlign?: TextAlign, vAlign?: Baseline): void;

  /**
   * Measures the width of a text
   *
   * @param text The text to measure
   * @param font The font to use
   * @returns {number}
   */
  measureTextWidth(text: string, font: Font): number;

  /**
   * Draws a simple line from four coordinates
   */
  drawSimpleLine(x1: number, y1: number, x2: number, y2: number, stroke: Stroke): void;

  /**
   * Draws a complex line
   */
  drawLine(line: Line, stroke: Stroke, targetTip: LineTip, sourceTip: LineTip): void;

  /**
   * Labels a line
   */
  labelLine(line: Line, font: Font, label: string, position?: number): void;
}
