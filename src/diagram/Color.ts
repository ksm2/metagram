import { Style } from './Style';

export class Color extends Style {
  red: number;
  green: number;
  blue: number;
  alpha: number;

  static readonly PRINT = Color.fromRGB(55, 58, 60);
  static readonly RED = Color.fromRGB(255, 0, 0);
  static readonly YELLOW = Color.fromRGB(255, 255, 0);
  static readonly GREEN = Color.fromRGB(0, 255, 0);
  static readonly CYAN = Color.fromRGB(0, 255, 255);
  static readonly BLUE = Color.fromRGB(0, 0, 255);
  static readonly MAGENTA = Color.fromRGB(255, 0, 255);
  static readonly WHITE = Color.fromRGB(255, 255, 255);
  static readonly BLACK = Color.fromRGB(0, 0, 0);

  static fromRGBA(red: number, green: number, blue: number, alpha: number): Color {
    return Object.assign(new Color(), { red, green, blue, alpha });
  }

  static fromRGB(red: number, green: number, blue: number): Color {
    return Color.fromRGBA(red, green, blue, 1);
  }

  toCanvasStyle(): string|CanvasGradient|CanvasPattern {
    const { red, green, blue, alpha } = this;
    return `rgba(${red},${green},${blue},${alpha})`;
  }
}
