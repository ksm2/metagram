declare interface JPEGOptions {
  bufsize?: number;
  quality?: number;
  progressive?: boolean;
}

type Quality = 'fast' | 'good' | 'best' | 'nearest' | 'bilinear';

declare interface CanvasRenderingContext2D {
  patternQuality: Quality;
  textDrawingMode: 'path' | 'glyph';
  filter: Quality;
  isPointInStroke(x: number, y: number): boolean;
}

declare module 'canvas' {
  type CanvasMimeType = 'image/png' | 'image/jpeg';

  interface CanvasFontOpts {
    family: string;
    weight?: string;
    style?: string;
  }

  class Canvas {
    /**
     * Gets or sets the height of a canvas element on a document.
     */
    height: number;
    /**
     * Gets or sets the width of a canvas element on a document.
     */
    width: number;

    constructor(width: number, height: number, format?: string);
    static version: string;
    static cairoVersion: string;
    static Context2d: {
      prototype: CanvasRenderingContext2D;
      new(): CanvasRenderingContext2D;
    };
    static registerFont(fontName: string, fontOpts: CanvasFontOpts): void;
    getContext(contextId: '2d', contextAttributes?: Canvas2DContextAttributes): CanvasRenderingContext2D | null;
    toBuffer(format?: string): Buffer;
    toDataURL(type: CanvasMimeType, opts: any, cb: (err: any, url: string) => void): void;
    toDataURL(type: CanvasMimeType, cb: (err: any, url: string) => void): void;
    toDataURL(cb: (err: any, url: string) => void): void;
    jpegStream(opts?: JPEGOptions): NodeJS.ReadableStream;
    pngStream(): NodeJS.ReadableStream;
  }

  export = Canvas;
}
