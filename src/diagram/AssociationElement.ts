import { Association } from '../models';
import { arrow, ArrowTipKind } from '../rendering';
import { Canvas } from '../canvas/Canvas';
import { Line } from '../rendering/Geometry';
import { Color } from './Color';
import { Edge } from './Edge';

export class AssociationElement extends Edge<Association> {
  constructor() {
    super();
    this.stroke = this.stroke.clone();
    this.stroke.dashOffset = 5;
  }

  renderLine(canvas: Canvas, line: Line): void {
    let stroke = this.stroke;
    if (this.hovered) {
      stroke = this.stroke.withStyle(Color.RED);
    }

    arrow(canvas.ctx, line, stroke, ArrowTipKind.NONE, ArrowTipKind.NONE, this.modelElement.name, this.font);
  }
}
