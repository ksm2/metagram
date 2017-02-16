import { Cursor } from '../diagram/Cursor';
import { DiagramElement } from '../diagram/DiagramElement';
import { Edge } from '../diagram/Edge';
import { Point } from '../diagram/Point';
import { InteractiveCanvas } from './InteractiveCanvas';

enum MouseButtons {
  LEFT = 1,
  RIGHT = 2,
  MIDDLE = 4,
  BACK = 8,
  FORWARD = 16
}

interface DOMMouseScroll extends MouseEvent {
  detail: number;
}

export class HTML5Canvas extends InteractiveCanvas {
  private _element: HTMLCanvasElement;
  private _isMoving: boolean;
  private _startedX: number;
  private _startedY: number;
  private _mouseDownElement: DiagramElement<any> | null;

  get width(): number {
    return this._element.width;
  }

  get height(): number {
    return this._element.height;
  }

  constructor(element: HTMLCanvasElement) {
    const ctx = element.getContext && element.getContext('2d');
    if (!ctx) throw 'HTML5 Context is not available';
    super(ctx);

    // Init event listeners
    element.addEventListener('mousedown', event => this.onMouseDown(event));
    element.addEventListener('mouseup'  , event => this.onMouseUp(event));
    element.addEventListener('mousemove', event => this.onMouseMove(event));
    element.addEventListener('mousewheel', event => this.onMouseWheelScroll(event.wheelDeltaY, event.offsetX, event.offsetY));
    element.addEventListener('DOMMouseScroll', (event: DOMMouseScroll) => this.onMouseWheelScroll(-event.detail, event.offsetX, event.offsetY));

    this._element = element;
  }

  resize(width: number, height: number): this {
    this._element.width = width;
    this._element.height = height;
    return this.rerender();
  }

  /**
   * Handles when a mouse button is pushed down on the canvas
   */
  onMouseDown(event: MouseEvent): void {
    const { offsetX, offsetY } = event;
    this._isMoving = false;
    this._startedX = offsetX / this.zoom;
    this._startedY = offsetY / this.zoom;
    this._mouseDownElement = this.getElementByPosition(offsetX, offsetY);
  }

  /**
   * Handles when a mouse button is released on the canvas
   */
  onMouseUp(event: MouseEvent): void {
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
  }

  /**
   * Handles when a mouse is moved over the canvas
   */
  onMouseMove(event: MouseEvent): void {
    const { offsetX, offsetY } = event;
    const leftButtonIsPressed = event.buttons & MouseButtons.LEFT;

    if (!leftButtonIsPressed) {
      this.hoveredElement = this.getElementByPosition(offsetX, offsetY);
      return;
    }

    let dx = (offsetX / this.zoom) - this._startedX;
    let dy = (offsetY / this.zoom) - this._startedY;

    // Extract a new waypoint
    if (!this._isMoving && this.selectedElements.size < 2 && this._mouseDownElement instanceof Edge) {
      this._isMoving = true;
      const x = Math.round(offsetX / this.gridX) * this.gridX;
      const y = Math.round(offsetY / this.gridY) * this.gridY;
      this._mouseDownElement.waypoint.push(new Point(x, y));
      this.rerender();

      return;
    }

    // Move the whole canvas
    if (!this.selectedElements.size) {
      this._startedX += dx;
      this._startedY += dy;
      this.moveOffset(dx, dy);
      return;
    }

    // Round to raster
    dx = Math.round(dx / this.gridX) * this.gridX;
    dy = Math.round(dy / this.gridY) * this.gridY;
    if (!dx && !dy) return;

    this._isMoving = true;
    this._startedX += dx;
    this._startedY += dy;
    this.selectedElements.forEach(element => this.moveElement(element, dx, dy));

    this.rerender();
  }

  /**
   * Handles when the mouse wheel is scrolled over the canvas
   */
  onMouseWheelScroll(delta: number, x: number, y: number) {
    if (delta < 0) {
      this.zoomIn(x, y);
    } else {
      this.zoomOut(x, y);
    }
  }

  protected changeCursor(cursor: Cursor): void {
    this._element.style.cursor = cursor;
  }
}
