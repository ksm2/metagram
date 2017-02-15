import { Package } from '../models/uml/Package';
import { Shape } from './Shape';
import { Class, Attribute } from '../decorators';
import { Canvas } from '../canvas/Canvas';
import { DiagramElement } from './DiagramElement';

@Class('Diagram', Shape)
export class Diagram extends Shape<Package> {
  private _name: string;
  private _documentation: string;
  private _resolution: number = 300;

  @Attribute({ type: String })
  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  @Attribute({ type: String })
  get documentation(): string {
    return this._documentation;
  }

  set documentation(value: string) {
    this._documentation = value;
  }

  @Attribute({ type: Number })
  get resolution(): number {
    return this._resolution;
  }

  set resolution(value: number) {
    this._resolution = value;
  }

  containsPoint(px: number, py: number): boolean {
    // A diagram always contains a point
    return true;
  }

  render(canvas: Canvas): void {
    for (let child of this.ownedElements) {
      child.render(canvas);
    }
  }

  getElementAtPosition(canvas: Canvas, x: number, y: number): DiagramElement<any> | null {
    for (let i = this.ownedElements.length - 1; i >= 0; i -= 1) {
      const element = this.ownedElements[i];
      let childElement;
      if (childElement = element.getElementAtPosition(canvas, x, y)) {
        return childElement;
      }
    }

    // Diagrams are not selectable
    return null;
  }
}
