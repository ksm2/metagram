import { Package } from '../models/uml/Package';
import { Shape } from './Shape';
import { measureTextWidth, rect, strokeRect, text, fillRect } from '../rendering';
import { Canvas } from '../canvas/Canvas';
import { Fill } from './Fill';
import { Color } from './Color';
import { Class } from '../decorators/index';

@Class('PackageElement', Shape)
export class PackageElement extends Shape<Package> {
  render(canvas: Canvas): void {
    const { ctx } = canvas;

    ctx.save();
    ctx.translate(this.bounds.x, this.bounds.y);
    const { modelElement, selected, hovered } = this;
    const { width, height } = this.bounds;

    const stereotypeFont = this.font;
    const stereotypeText = `«${this.modelElement.stereotype || 'Package'}»`;
    const nameFont = this.font;
    const nameText = modelElement.name || '';

    const nameWidth = measureTextWidth(ctx, nameText, nameFont);
    const stereotypeWidth = measureTextWidth(ctx, stereotypeText, stereotypeFont);

    const labelWidth = Math.min(width, Math.max(nameWidth, stereotypeWidth, 100) + 25);
    const labelHeight = 50;
    rect(ctx, { width: labelWidth, height: labelHeight }, this.stroke, this.fill);
    text(ctx, stereotypeText, { x: 10, y: 16 }, stereotypeFont);
    text(ctx, nameText, { x: 10, y: 34 }, nameFont);

    strokeRect(ctx, { width, height }, this.stroke);

    if (selected || hovered) fillRect(ctx, { width: labelWidth, height: labelHeight }, Fill.fromStyle(Color.fromRGBA(0, 0, 0, 0.1)));

    // Render contained elements
    for (let element of this.ownedElements) {
      element.render(canvas);
    }

    ctx.restore();
  }
}
