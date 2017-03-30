import { Package } from '../models';
import { Shape } from './Shape';
import { Canvas } from '../canvas/Canvas';
import { Fill } from './Fill';
import { Color } from './Color';
import { Bounds } from './Bounds';
import { Class } from '../decorators';

@Class('PackageElement', Shape)
export class PackageElement extends Shape<Package> {
  renderContents(canvas: Canvas): void {
    const { modelElement, selected, hovered } = this;
    const { width } = this.bounds;

    const stereotypeFont = this.font;
    const stereotypeText = `«${this.modelElement.stereotype || 'Package'}»`;
    const nameFont = this.font;
    const nameText = modelElement.name || '';

    const nameWidth = canvas.measureTextWidth(nameText, nameFont);
    const stereotypeWidth = canvas.measureTextWidth(stereotypeText, stereotypeFont);

    const labelWidth = Math.min(width, Math.max(nameWidth, stereotypeWidth, 100) + 25);
    const labelHeight = 50;
    const labelBounds = new Bounds(0, 0, labelWidth, labelHeight);
    canvas.fillRectangle(labelBounds, this.fill);
    canvas.strokeRectangle(labelBounds, this.stroke);
    canvas.drawText(stereotypeText, 10, 16, stereotypeFont);
    canvas.drawText(nameText, 10, 34, nameFont);

    canvas.strokeRectangle(this.bounds.dimension, this.stroke);

    // Draw a black overlay if selected or hovered
    if (selected || hovered) canvas.fillRectangle(this.bounds.dimension, Fill.fromStyle(Color.fromRGBA(0, 0, 0, 0.1)));

    // Render contained elements
    for (let element of this.ownedElements) {
      element.render(canvas);
    }
  }
}
