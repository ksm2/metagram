import { Element } from '../models/Element';

export abstract class Style extends Element {
  /**
   * Transforms the style to a canvas applicable format
   */
  abstract toCanvasStyle(): string | CanvasGradient | CanvasPattern;
}
