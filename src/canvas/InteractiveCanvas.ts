import { Canvas } from './Canvas';
import { Handle } from '../diagram/Handle';
import { DiagramElement } from '../diagram/DiagramElement';

const zoomLevels = [1/8, 1/7, 1/6, 1/5, 1/4, 1/3, 1/2, 2/3, 1, 3/2, 2, 3, 4, 5, 6, 7, 8];

export abstract class InteractiveCanvas extends Canvas {
  private _selectedElements: Set<DiagramElement<any>>;
  private _handles: Map<DiagramElement<any>, Handle[]>;
  private _hoveredElement: DiagramElement<any> | null;

  set hoveredElement(element: DiagramElement<any> | null) {
    if (this._hoveredElement) this._hoveredElement.hover(false);
    this._hoveredElement = element;
    this.changeCursor(element ? element.cursor : 'default');
    if (this._hoveredElement) this._hoveredElement.hover(true);
    this.rerender();
  }

  get hoveredElement(): DiagramElement<any> | null {
    return this._hoveredElement;
  }

  get selectedElements(): Set<DiagramElement<any>> {
    return this._selectedElements;
  }

  constructor(ctx: CanvasRenderingContext2D) {
    super(ctx);

    this._handles = new Map();
    this._selectedElements = new Set();
    this._hoveredElement = null;
  }

  /**
   * Renders the canvas
   */
  protected render(): this {
    super.render();
    this.pushCanvasStack();
    this.ctx.scale(this.zoom, this.zoom);
    this.ctx.translate(this.offsetX, this.offsetY);
    this._handles.forEach(handles => handles.forEach(handle => handle.render(this)));
    this.popCanvasStack();
    return this;
  }

  /**
   * Returns the element at the given position
   */
  getElementByPosition(x: number, y: number): DiagramElement<any> | null {
    const realX = x / this.zoom - this.offsetX;
    const realY = y / this.zoom - this.offsetY;
    const handleAtPos = this.getHandleByPosition(realX, realY);
    if (handleAtPos) return handleAtPos;

    return this.diagram && this.diagram.getElementAtPosition(this, realX, realY) || null;
  }

  /**
   * Returns the handle at the given position
   */
  getHandleByPosition(x: number, y: number): Handle | null {
    for (let handles of this._handles.values()) {
      for (let handle of handles) {
        if (handle.containsPoint(x, y)) return handle;
      }
    }

    return null;
  }
  /**
   * Selects a given element
   */
  addSelection(element: DiagramElement<any>): void {
    this._selectedElements.add(element);
    // Add handles of the element
    this.updateHandles(element);
    element.select();
    element.on('resize', () => {
      this.updateHandles(element);
    });
  }

  /**
   * Deselects a given element
   */
  deleteSelection(element: DiagramElement<any>): boolean {
    // Remove handles
    this._handles.delete(element);
    element.deselect();
    element.off('resize');
    return this._selectedElements.delete(element);
  }

  /**
   * Moves an element on the canvas
   *
   * @param element The element to move
   * @param dx Movement in X direction
   * @param dy Movement in Y direction
   */
  moveElement(element: DiagramElement<any>, dx: number, dy: number) {
    element.move(dx, dy);
    // Update the element's handles
    if (this._handles.has(element)) {
      this.updateHandles(element);
    }
  }

  /**
   * Tests whether an element is selected
   */
  isSelected(element: DiagramElement<any>): boolean {
    return this._selectedElements.has(element);
  }

  /**
   * Clears the selection of all canvas elements
   */
  clearSelection() {
    this._handles.clear();
    this._selectedElements.forEach((element) => {
      element.deselect();
      element.off('resize');
    });
    this._selectedElements.clear();
  }

  /**
   * Zooms into the diagram
   */
  zoomIn(x?: number, y?: number) {
    this.zoomCanvas(zoomLevels[Math.min(zoomLevels.length - 1, zoomLevels.indexOf(this.zoom) + 1)], x, y);
  }

  /**
   * Zooms out of the diagram
   */
  zoomOut(x?: number, y?: number) {
    this.zoomCanvas(zoomLevels[Math.max(0, zoomLevels.indexOf(this.zoom) - 1)], x, y);
  }

  /**
   * Zooms 100%
   */
  zoom100(x?: number, y?: number) {
    this.zoomCanvas(1, x, y);
  }

  /**
   * Updates the handles of a given element
   *
   * @param element The element who's handles are updated
   */
  protected updateHandles(element: DiagramElement<any>) {
    this._handles.set(element, element.createHandles(this));
  }
}
