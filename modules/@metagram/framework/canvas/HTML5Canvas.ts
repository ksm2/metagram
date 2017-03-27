import { Cursor } from '../diagram/Cursor';
import { DiagramElement } from '../diagram/DiagramElement';
import { Edge } from '../diagram/Edge';
import { Point } from '../diagram/Point';
import { InteractiveCanvas } from './InteractiveCanvas';
import { Handle } from '../diagram/Handle';
import { SVGCanvas } from './SVGCanvas';
import { PDFCanvas } from './PDFCanvas';

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
  private _clickedElement: DiagramElement<any> | null;

  get width(): number {
    return this._element.width;
  }

  get height(): number {
    return this._element.height;
  }

  get cursor(): Cursor {
    return this._element.style.cursor as Cursor;
  }

  set cursor(cursor: Cursor) {
    this._element.style.cursor = cursor;
  }

  constructor(element: HTMLCanvasElement) {
    const ctx = element.getContext && element.getContext('2d');
    if (!ctx) throw 'HTML5 Context is not available';
    super(ctx);

    // Init event listeners
    element.addEventListener('keydown', event => this.onKeyPress(event), true);
    element.addEventListener('mousedown', event => this.onMouseDown(event));
    element.addEventListener('mouseup'  , event => this.onMouseUp(event));
    element.addEventListener('mousemove', event => this.onMouseMove(event));
    element.addEventListener('contextmenu', event => this.onContextMenu(event));
    element.addEventListener('mousewheel', event => this.onMouseWheelScroll(event.wheelDeltaY, event.offsetX, event.offsetY));
    element.addEventListener('DOMMouseScroll', (event: DOMMouseScroll) => this.onMouseWheelScroll(-event.detail, event.offsetX, event.offsetY));

    // Init clock
    let clock = 0;
    setInterval(() => {
      this.selectedElements.forEach(element => element.onTick(clock, this));
      clock += 1;
      this.rerender();
    }, 500);

    this._element = element;
  }

  resize(width: number, height: number): this {
    this._element.width = width;
    this._element.height = height;
    return this.rerender();
  }

  onKeyPress(event: KeyboardEvent): void {
    event.preventDefault();
    this.selectedElements.forEach(element => element.onKeyPress(event.key, this));
    this.rerender();
  }

  /**
   * Handles when a mouse button is pushed down on the canvas
   */
  onMouseDown(event: MouseEvent): void {
    const { offsetX, offsetY } = event;
    this._isMoving = false;
    this._startedX = offsetX / this.zoom;
    this._startedY = offsetY / this.zoom;
    this._clickedElement = this.getElementByPosition(offsetX, offsetY);
  }

  /**
   * Handles when a mouse button is released on the canvas
   */
  onMouseUp(event: MouseEvent): void {
    if (this._isMoving) return;

    const { offsetX, offsetY, button } = event;
    const element = this.getElementByPosition(offsetX, offsetY);

    switch (button) {
      case 0:
        this.onLeftClick(element, event);
        break;
      case 1:
        this.onMiddleClick(element, event);
        break;
      case 2:
        this.onRightClick(element, event);
        break;
    }
  }

  /**
   * Handles when a mouse is moved over the canvas
   */
  onMouseMove(event: MouseEvent): void {
    const { offsetX, offsetY, buttons } = event;
    const leftButtonIsPressed = buttons & MouseButtons.LEFT;

    if (!leftButtonIsPressed) {
      this.hoveredElement = this.getElementByPosition(offsetX, offsetY);
      if (this.hoveredElement) {
        const [x, y] = this.getElementCoordinates(this.hoveredElement);
        const [px, py] = [offsetX / this.zoom - this.offsetX - x, offsetY / this.zoom - this.offsetY - y];
        this.hoveredElement.onMouseMove(px, py, this);
      }
      return;
    }

    let dx = (offsetX / this.zoom) - this._startedX;
    let dy = (offsetY / this.zoom) - this._startedY;

    // Extract a new waypoint
    if (!this._isMoving && this.selectedElements.size < 2 && this._clickedElement instanceof Edge) {
      this._isMoving = true;
      this.extractNewEdgeWaypoint(this._clickedElement, offsetX, offsetY);
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
    [dx, dy] = this.snapToGrid(dx, dy);
    if (!dx && !dy) return;

    this._isMoving = true;
    this._startedX += dx;
    this._startedY += dy;
    if (this.selectedElements.size < 2 && this._clickedElement) {
      const [x, y] = this.getElementCoordinates(this._clickedElement);
      [dx, dy] = this.snapToGrid(x + dx, y + dy);
      dx -= x; dy -= y;
      this._clickedElement.move(dx, dy);
    } else {
      this.selectedElements.forEach(element => this.moveElement(element, dx, dy));
    }

    this.rerender();
  }

  /**
   * Handles context menu events on the element
   */
  onContextMenu(event: Event) {
    event.preventDefault();
    event.stopPropagation();
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

  /**
   * Handles a left click in the canvas
   *
   * @param clickedElement The clicked element or null, if no element was hit
   * @param event The mouse event triggered
   */
  onLeftClick(clickedElement: DiagramElement<any> | null, event: MouseEvent) {
    const shiftKey = event.shiftKey;

    // Clear selection first
    if (!shiftKey) {
      this.clearSelection();
    }

    // Add or remove specific element
    if (clickedElement) {
      if (shiftKey && this.isSelected(clickedElement)) {
        this.deleteSelection(clickedElement);
      } else {
        this.addSelection(clickedElement);
      }
    }

    this.rerender();
  }

  /**
   * Handles a middle click in the canvas
   *
   * @param clickedElement The clicked element or null, if no element was hit
   * @param event The mouse event triggered
   */
  onMiddleClick(clickedElement: DiagramElement<any> | null, event: MouseEvent) {
  }

  /**
   * Handles a right click in the canvas
   *
   * @param clickedElement The clicked element or null, if no element was hit
   * @param event The mouse event triggered
   */
  onRightClick(clickedElement: DiagramElement<any> | null, event: MouseEvent) {
    // Remove waypoint on right click
    if (clickedElement instanceof Handle) {
      const handleOwner = clickedElement.owningElement;
      if (handleOwner instanceof Edge) {
        const number = handleOwner.waypoint.indexOf(clickedElement.attachedTo);
        if (number >= 0) {
          handleOwner.waypoint.splice(number, 1);
          this.updateHandles(handleOwner);
          this.rerender();
        }
      }
    }
  }

  /**
   * Generates an image data URL from the canvas
   *
   * @param zoom The zoom factor used for the generated image
   * @param format The format as mime type. By default this is image/png
   * @param quality If JPEG, a quality can be specified
   * @returns A data URL covering the image data
   */
  generateImage(zoom: number, format: string = 'image/png', quality?: number): string {
    // No diagram present?
    if (!this.diagram) return 'data:,';

    if (format == 'application/pdf') {
      return this.generatePDF(zoom);
    }

    if (format == 'image/svg+xml') {
      return this.generateSVG(zoom);
    }

    // Retrieve diagram dimensions
    const dim = this.diagram.calcAllElementBounds();

    // Create element
    const el = window.document.createElement('canvas');
    el.width = zoom * dim.width;
    el.height = zoom * dim.height;

    // Draw the contents
    const canvas = new HTML5Canvas(el);
    canvas.moveOffset(-dim.x, -dim.y);
    canvas.zoom = zoom;
    canvas.diagram = this.diagram;
    if (format === 'image/jpeg') {
      canvas.background = 'white';
    }

    // Extract data URL
    return el.toDataURL(format, quality);
  }

  /**
   * Generates an SVG data URL from the canvas
   *
   * @param zoom The zoom factor used for the generated image
   * @returns A data URL covering the image data
   */
  generateSVG(zoom: number): string {
    // No diagram present?
    const diagram = this.diagram;
    if (!diagram) return 'data:,';

    // Draw the contents
    const canvas = new SVGCanvas(diagram, zoom);
    return canvas.toDataURL();
  }

  /**
   * Generates an SVG data URL from the canvas
   *
   * @param zoom The zoom factor used for the generated image
   * @returns A data URL covering the image data
   */
  generatePDF(zoom: number): string {
    // No diagram present?
    const diagram = this.diagram;
    if (!diagram) return 'data:,';

    // Draw the contents
    const canvas = new PDFCanvas(diagram, zoom);
    return canvas.toDataURL();
  }

  /**
   * Extracts a new edge waypoint
   *
   * @param edge The edge who receives the new waypoint
   * @param px X position
   * @param py Y position
   */
  private extractNewEdgeWaypoint(edge: Edge<any>, px: number, py: number) {
    const [x, y] = this.snapToGrid(px, py);
    const point = new Point(x, y);

    // Calculate nearest line segment to add the point there
    const index = edge.waylines.getNearestLine(point);
    edge.waypoint.splice(index, 0, point);

    this.updateHandles(edge);
    this.rerender();
  }

  /**
   * Snaps coordinates to the grid
   *
   * @param px Original X coordinate
   * @param py Original Y coordinate
   * @returns Coordinates on the grid
   */
  private snapToGrid(px: number, py: number): [number, number] {
    return [
      Math.round(px / this.gridX) * this.gridX,
      Math.round(py / this.gridY) * this.gridY,
    ];
  }
}
