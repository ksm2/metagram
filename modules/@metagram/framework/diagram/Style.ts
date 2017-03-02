import { Element } from '@metagram/models';

export abstract class Style extends Element {
  /**
   * Transforms the style to a canvas applicable format
   */
  abstract toCanvasStyle(): string | CanvasGradient | CanvasPattern;

  /**
   * Transforms the style to a PDF applicable format
   */
  abstract toHex(): string;
}
