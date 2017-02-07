import { DiagramElement } from '../diagram';
import { ModelElement } from '../models';
import { Diagram } from '../diagram';
import { Cursor } from '../diagram/Cursor';
import { Handle } from '../diagram/Handle';
import { Bounds } from '../diagram/Bounds';
import { Point } from '../diagram/Point';

export interface ResolveFunction<M extends ModelElement> {
  (m: M): DiagramElement<M>;
}

export abstract class Canvas {
  ctx: CanvasRenderingContext2D;

  private _selectedElements: Set<DiagramElement<any>>;
  private _resolution: number = 300;
  private _grid: boolean;
  private _gridX: number;
  private _gridY: number;
  private _diagram: Diagram | null;
  private _hoveredElement: DiagramElement<any> | null;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;

    this._selectedElements = new Set();
    this._grid = false;
    this._gridX = 25;
    this._gridY = 25;
    this._diagram = null;
    this._hoveredElement = null;
  }

  set grid(val: boolean) {
    this._grid = val;
    this.rerender();
  }

  get grid(): boolean {
    return this._grid;
  }

  get resolution(): number {
    return this._resolution;
  }

  get userUnitsPerInch(): number {
    return this._resolution;
  }

  get userUnitsPerPoint(): number {
    return this._resolution / 72;
  }

  set diagram(val: Diagram | null) {
    this._diagram = val;
    this.rerender();
  }

  get diagram(): Diagram | null {
    return this._diagram;
  }

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

  get gridX(): number {
    return this._gridX;
  }

  get gridY(): number {
    return this._gridY;
  }

  /**
   * Returns the current width of the canvas
   */
  abstract get width(): number;

  /**
   * Returns the current height of the canvas
   */
  abstract get height(): number;

  /**
   * Returns the element at the given position
   */
  getElementByPosition(x: number, y: number): DiagramElement<any> | null {
    // this._selectedElements.
    const handles: Handle[] = Array.prototype.concat.apply([], Array.from(this._selectedElements).map(el => el.handles));
    const handleAtPos = handles.find(handle => handle.containsPoint(this, x, y));
    if (handleAtPos) return handleAtPos;

    return this._diagram && this._diagram.getElementAtPosition(this, x, y) || null;
  }

  /**
   * Selects a given element
   */
  addSelection(element: DiagramElement<any>): void {
    this._selectedElements.add(element);
    element.select();
  }

  /**
   * Deselects a given element
   */
  deleteSelection(element: DiagramElement<any>): boolean {
    element.deselect();
    return this._selectedElements.delete(element);
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
    this._selectedElements.forEach(element => element.deselect());
    this._selectedElements.clear();
  }

  /**
   * Pushes the canvas stack
   */
  pushCanvasStack() {
    this.ctx.save();
  }

  /**
   * Pops the canvas stack
   */
  popCanvasStack() {
    this.ctx.restore();
  }

  translate(offset: Point) {
    this.ctx.translate(offset.x, offset.y);
  }

  /**
   * Draws a rectangle within the given bounds
   */
  drawRectangle(bounds: Bounds) {
    this.ctx.rect(bounds.x, bounds.y, bounds.width, bounds.height);
  }

  /**
   * Clips the canvas to a rectangle
   */
  clipRectangle(bounds: Bounds) {
    this.drawRectangle(bounds);
    this.ctx.clip();
  }

  /**
   * Resizes the canvas
   *
   * @param width The new width of the canvas
   * @param height The new height of the canvas
   */
  abstract resize(width: number, height: number): this;

  /**
   * Renders the canvas
   */
  protected render(): this {
    if (this._grid) this.renderGrid();
    if (this._diagram) this._diagram.render(this);
    this._selectedElements.forEach(element => element.handles.forEach(handle => handle.render(this)));
    return this;
  }

  /**
   * Invalidates and renders the canvas
   */
  protected rerender(): this {
    this.invalidate();
    return this.render();
  }

  /**
   * Invalidates the canvas by emptying it
   */
  protected invalidate(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Changes the cursor displayed on the canvas
   */
  protected changeCursor(cursor: Cursor): void {
  }

  /**
   * Renders a grid in the background
   */
  private renderGrid(): void {
    const { ctx, width, height } = this;

    // Set grid properties
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';

    // Render vertical lines
    for (let x = this._gridX; x < width - 1; x += this._gridX) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Render horizontal lines
    for (let y = this._gridY; y < height - 1; y += this._gridY) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.restore();
  }
}
