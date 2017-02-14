import { PackageImport } from '../models';
import { arrow, ArrowTipKind } from '../rendering';
import { Canvas } from '../canvas/Canvas';
import { Color } from './Color';
import { Edge } from './Edge';
import { Line } from './Line';

export class PackageImportElement extends Edge<PackageImport> {
  constructor() {
    super();
    this.stroke = this.stroke.clone();
    this.stroke.dashOffset = 10;
  }

  renderLineSegment(canvas: Canvas, line: Line): void {
    let stroke = this.stroke;
    if (this.hovered) {
      stroke = this.stroke.withStyle(Color.RED);
    }

    arrow(canvas.ctx, line, stroke, ArrowTipKind.NONE, ArrowTipKind.NONE, this.font, this.modelElement && this.modelElement.name);
  }
}
