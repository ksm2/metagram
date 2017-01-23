import fs = require('fs');
import path = require('path');
import Canvas = require('canvas');
import { Canvas as BaseCanvas } from './Canvas';
import { WriteStream } from 'fs';

export enum ImageFormat {
  SVG,
  PDF,
  PNG,
  JPEG
}

export class NodeCanvas extends BaseCanvas {
  private _canvas: Canvas;
  private _vectorFormat?: string;

  constructor(width: number, height: number, vectorFormat?: string) {
    const canvas = new Canvas(width, height, vectorFormat);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw 'CanvasRenderingContext2D is not available';
    super(ctx);
    if (this._vectorFormat) ctx.textDrawingMode = 'glyph';

    this._canvas = canvas;
    this._vectorFormat = vectorFormat;
  }

  get width(): number {
    return this._canvas.width;
  }

  get height(): number {
    return this._canvas.height;
  }

  resize(width: number, height: number): this {
    this._canvas.width = width;
    this._canvas.height = height;
    return this.render();
  }

  saveToFile(filename: string, format?: ImageFormat, jpegOptions?: JPEGOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const writeStream = fs.createWriteStream(filename);
      writeStream.on('finish', () => resolve());
      writeStream.on('error', (e: any) => reject(e));
      this.saveToWriteStream(writeStream, format || this.getFormatFromPath(filename), jpegOptions);
    });
  }

  private saveToWriteStream(writeStream: WriteStream, format: ImageFormat, jpegOptions?: JPEGOptions) {
    switch (format) {
      case ImageFormat.PNG: {
        if (this._vectorFormat) throw 'This is not a raster image canvas';
        this._canvas.pngStream().pipe(writeStream);
        return;
      }
      case ImageFormat.JPEG: {
        if (this._vectorFormat) throw 'This is not a raster image canvas';
        this._canvas.jpegStream(jpegOptions).pipe(writeStream);
        return;
      }
      case ImageFormat.SVG: {
        if (this._vectorFormat !== 'svg') throw 'This is not a SVG canvas';
        writeStream.write(this._canvas.toBuffer());
        writeStream.end();
        return;
      }
      case ImageFormat.PDF: {
        if (this._vectorFormat !== 'pdf') throw 'This is not a PDF canvas';
        writeStream.write(this._canvas.toBuffer());
        writeStream.end();
        return;
      }
    }
  }

  private getFormatFromPath(filename: string): ImageFormat {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
      case '.png':
        return ImageFormat.PNG;
      case '.pdf':
        return ImageFormat.PDF;
      case '.svg':
        return ImageFormat.SVG;
      case '.jpg':
      case '.jpeg':
        return ImageFormat.JPEG;
      default:
        throw `Unrecognized file extension: ${ext}`;
    }
  }
}
