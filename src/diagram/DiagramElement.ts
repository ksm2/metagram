import { Element } from '../models/Element';
import { ModelElement } from '../models/uml/ModelElement';
import { Canvas } from '../canvas/Canvas';
import { Handle } from './Handle';
import { Cursor } from './Cursor';
import { Class, Attribute } from '../decorators/index';
import { Bounds } from './Bounds';
import { Shape } from './Shape';

@Class('DiagramElement', Element)
export class DiagramElement<M extends ModelElement> extends Element {
  private _modelElement: M;
  private _cursor: Cursor = 'default';
  private _handles: Handle[] = [];
  private _selected: boolean = false;
  private _hovered: boolean = false;
  private _ownedElements: DiagramElement<any>[] = [];
  private _owningElement: DiagramElement<any> | null = null;

  @Attribute({ type: Element, lower: 0 })
  get modelElement(): M {
    return this._modelElement;
  }

  set modelElement(m: M) {
    this._modelElement = m;
  }

  @Attribute({ type: DiagramElement, lower: 0, upper: Infinity })
  get ownedElements(): DiagramElement<any>[] {
    return this._ownedElements;
  }

  set ownedElements(value: DiagramElement<any>[]) {
    this._ownedElements = value;
  }

  @Attribute({ type: DiagramElement, lower: 0 })
  get owningElement(): DiagramElement<any> | null {
    return this._owningElement;
  }

  set owningElement(value: DiagramElement<any> | null) {
    this._owningElement = value;
  }

  @Attribute({ type: String })
  get cursor(): Cursor {
    return this._cursor;
  }

  set cursor(value: Cursor) {
    this._cursor = value;
  }

  get handles(): Handle[] {
    return this._handles;
  }

  get selected(): boolean {
    return this._selected;
  }

  get hovered(): boolean {
    return this._hovered;
  }

  render(canvas: Canvas): void {
  }

  /**
   * Checks whether this element contains a given point
   *
   * @param px X coordinate of the point to check
   * @param py Y coordinate of the point to check
   */
  containsPoint(px: number, py: number): boolean {
    return false;
  }

  /**
   * Returns a meaningful string representation
   */
  toString(): string {
    return `[${this.modelElement.name}]`;
  }

  /**
   * Move the element on the canvas
   */
  move(dx: number, dy: number): void {
  }

  /**
   * Selects the element
   */
  select() {
    this._selected = true;
  }

  /**
   * Deselects the element
   */
  deselect() {
    this._selected = false;
  }

  hover(val: boolean) {
    this._selected = val;
  }

  /**
   * Returns the element at a given position.
   */
  getElementAtPosition(canvas: Canvas, x: number, y: number): DiagramElement<any> | null {
    if (!this.containsPoint(x, y)) {
      return null;
    }

    for (let i = this._ownedElements.length - 1; i >= 0; i -= 1) {
      const element = this._ownedElements[i];
      let childElement;
      if (childElement = element.getElementAtPosition(canvas, x, y)) {
        return childElement;
      }
    }

    return this;
  }

  calcAllElementBounds(): Bounds {
    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;
    let maxX = 0;
    let maxY = 0;

    for (let element of this.ownedElements) {
      if (element instanceof Shape) {
        minX = Math.min(minX, element.bounds.x);
        minY = Math.min(minY, element.bounds.y);
        maxX = Math.max(maxX, element.bounds.x + element.bounds.width);
        maxY = Math.max(maxY, element.bounds.y + element.bounds.height);
      }
    }

    return new Bounds(minX, minY, maxX - minX, maxY - minY);
  }
}
