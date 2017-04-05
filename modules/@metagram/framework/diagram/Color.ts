import { Style } from './Style';

export class Color extends Style {
  static readonly PRINT = new Color(55, 58, 60);
  static readonly RED = new Color(255, 0, 0);
  static readonly YELLOW = new Color(255, 255, 0);
  static readonly GREEN = new Color(0, 255, 0);
  static readonly CYAN = new Color(0, 255, 255);
  static readonly BLUE = new Color(0, 0, 255);
  static readonly MAGENTA = new Color(255, 0, 255);
  static readonly WHITE = new Color(255, 255, 255);
  static readonly BLACK = new Color(0, 0, 0);

  constructor(public red: number = 0, public green = 0, public blue = 0, public alpha = 1) {
    super();
  }

  toCanvasStyle(): string | CanvasGradient | CanvasPattern {
    const { red, green, blue, alpha } = this;
    return `rgba(${red},${green},${blue},${alpha})`;
  }

  toHex(): string {
    const { red, green, blue, alpha } = this;
    return `#${red.toString(16)}${green.toString(16)}${blue.toString(16)}`;
  }
}
