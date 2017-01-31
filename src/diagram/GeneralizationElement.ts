import { Generalization } from '../models';
import { arrow, ArrowTipKind } from '../rendering';
import { Canvas } from '../canvas/Canvas';
import { Color } from './Color';
import { Edge } from './Edge';
import { Line } from './Line';

export class GeneralizationElement extends Edge<Generalization> {
  renderLineSegment(canvas: Canvas, line: Line, index: number, isLastSegment: boolean): void {
    let stroke = this.stroke;
    if (this.hovered) {
      stroke = this.stroke.withStyle(Color.RED);
    }

    arrow(canvas.ctx, line, stroke, isLastSegment ? ArrowTipKind.TRIANGLE : ArrowTipKind.NONE, ArrowTipKind.NONE, this.modelElement && this.modelElement.name, this.font);
  }
}
