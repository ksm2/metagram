import { AbstractCanvas } from './AbstractCanvas';
import fs = require('fs');
import path = require('path');
import Canvas = require('canvas');
import { WriteStream } from 'fs';

export type ImageFormat = 'svg' | 'pdf' | 'png' | 'jpeg';

export class NodeCanvas extends AbstractCanvas {
  private _canvas: Canvas;
  private _imageFormat?: string;

  constructor(width: number, height: number, imageFormat?: ImageFormat) {
    const canvas = new Canvas(width, height, imageFormat);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw 'CanvasRenderingContext2D is not available';
    super(ctx);
    if (this._imageFormat) ctx.textDrawingMode = 'glyph';

    this._canvas = canvas;
    this._imageFormat = imageFormat;
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

  saveToFile(filename: string, jpegOptions?: JPEGOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const writeStream = fs.createWriteStream(filename);
      writeStream.on('finish', () => resolve());
      writeStream.on('error', (e: any) => reject(e));
      this.saveToWriteStream(writeStream, jpegOptions);
    });
  }

  /**
   * Outputs the image as an data URL
   */
  toDataURL(): string {
    switch (this._imageFormat) {
      case 'png': {
        return this._canvas.toDataURL('image/png');
      }
      case 'jpeg': {
        return this._canvas.toDataURL('image/jpeg');
      }
      case 'svg': {
        return `data:image/svg+xml;${this._canvas.toBuffer().toString()}`;
      }
      case 'pdf': {
        const base64 = this._canvas.toBuffer().toString('base64');
        return `data:application/pdf;base64,${base64}`;
      }
      default: {
        throw new Error(`Unsupported image format: ${this._imageFormat}`);
      }
    }
  }

  private saveToWriteStream(writeStream: WriteStream, jpegOptions?: JPEGOptions) {
    switch (this._imageFormat) {
      case 'png': {
        this._canvas.pngStream().pipe(writeStream);
        return;
      }
      case 'jpeg': {
        this._canvas.jpegStream(jpegOptions).pipe(writeStream);
        return;
      }
      case 'svg': {
        writeStream.write(this._canvas.toBuffer());
        writeStream.end();
        return;
      }
      case 'pdf': {
        writeStream.write(this._canvas.toBuffer());
        writeStream.end();
        return;
      }
    }
  }
}
