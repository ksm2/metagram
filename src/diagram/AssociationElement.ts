import { Association } from '../models';
import { arrow, ArrowTipKind } from '../rendering';
import { Canvas } from '../canvas/Canvas';
import { Color } from './Color';
import { Edge } from './Edge';
import { Line } from './Line';
import { AggregationKind } from '../models/AggregationKind';

export class AssociationElement extends Edge<Association> {
  renderLineSegment(canvas: Canvas, line: Line, isLastSegment: boolean): void {
    let stroke = this.stroke;
    if (this.hovered) {
      stroke = this.stroke.withStyle(Color.RED);
    }

    let arrowEnd = ArrowTipKind.NONE;
    if (isLastSegment) {
      const aggregation = this.modelElement.memberEnd[0].aggregation;
      switch (aggregation) {
        case AggregationKind.composite:
          arrowEnd = ArrowTipKind.DIAMOND_FILLED;
          break;
        case AggregationKind.shared:
          arrowEnd = ArrowTipKind.DIAMOND;
          break;
      }
    }

    arrow(canvas.ctx, line, stroke, arrowEnd, ArrowTipKind.NONE);
  }
}
