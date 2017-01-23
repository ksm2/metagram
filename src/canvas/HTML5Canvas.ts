import { Canvas } from './Canvas';
import { Cursor } from '../diagram/Cursor';
import { DiagramElement } from '../diagram/DiagramElement';

export class HTML5Canvas extends Canvas {
  private _element: HTMLCanvasElement;
  private _isMoving: boolean;
  private _startedX: number;
  private _startedY: number;
  private _mouseDownElement: DiagramElement<any> | null;

  constructor(element: HTMLCanvasElement) {
    const ctx = element.getContext && element.getContext('2d');
    if (!ctx) throw 'HTML5 Context is not available';
    super(ctx);

    // Init event listeners
    element.addEventListener('mousedown', (event) => {
      const { offsetX, offsetY } = event;
      this._isMoving = false;
      this._startedX = offsetX;
      this._startedY = offsetY;
      this._mouseDownElement = this.getElementByPosition(offsetX, offsetY);
    });

    element.addEventListener('mouseup', (event) => {
      if (this._isMoving) return;

      const { offsetX, offsetY, shiftKey } = event;
      const element = this.getElementByPosition(offsetX, offsetY);

      // Clear selection first
      if (!shiftKey) {
        this.clearSelection();
      }

      // Add or remove specific element
      if (element) {
        if (shiftKey && this.isSelected(element)) {
          this.deleteSelection(element);
        } else {
          this.addSelection(element);
        }
      }

      this.rerender();
    });

    element.addEventListener('mousemove', (event) => {
      const { offsetX, offsetY } = event;
      if (!(event.buttons & 1)) {
        this.hoveredElement = this.getElementByPosition(offsetX, offsetY);
        return;
      }

      let dx = offsetX - this._startedX;
      let dy = offsetY - this._startedY;

      // Round to raster
      dx = Math.round(dx / this.gridX) * this.gridX;
      dy = Math.round(dy / this.gridY) * this.gridY;
      if (!dx && !dy) return;

      this._isMoving = true;
      this._startedX += dx;
      this._startedY += dy;
      if (this.selectedElements.size < 2 && this._mouseDownElement) {
        this._mouseDownElement.move(dx, dy);
      } else {
        this.selectedElements.forEach(element => element.move(dx, dy));
      }
      this.rerender();
    });

    this._element = element;
  }

  get width(): number {
    return this._element.width;
  }

  get height(): number {
    return this._element.height;
  }

  resize(width: number, height: number): this {
    this._element.width = width;
    this._element.height = height;
    return this.render();
  }

  protected changeCursor(cursor: Cursor): void {
    this._element.style.cursor = cursor;
  }
}
