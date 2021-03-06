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
    toDataURL(): string;
    toDataURL(type: string): string;
    toDataURL(type: string, opts: any, cb: (err: any, url: string) => void): void;
    toDataURL(type: string, cb: (err: any, url: string) => void): void;
    toDataURL(cb: (err: any, url: string) => void): void;
    jpegStream(opts?: JPEGOptions): NodeJS.ReadableStream;
    pngStream(): NodeJS.ReadableStream;
  }

  export = Canvas;
}

declare module 'canvas2svg' {
  class C2S extends CanvasRenderingContext2D {
    constructor(width: number, height: number);
    getSerializedSvg(numbers?: boolean): string;
  }

  export = C2S;
}
