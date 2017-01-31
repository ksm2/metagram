import { Association } from '../models';
import { arrow, ArrowTipKind } from '../rendering';
import { Canvas } from '../canvas/Canvas';
import { Color } from './Color';
import { Edge } from './Edge';
import { Line } from './Line';
import { AggregationKind } from '../models/AggregationKind';
import { Property } from '../models/Property';

export class AssociationElement extends Edge<Association> {
  renderLineSegment(canvas: Canvas, line: Line, index: number, isLastSegment: boolean): void {
    let stroke = this.stroke;
    if (this.hovered) {
      stroke = this.stroke.withStyle(Color.RED);
    }

    // Check arrow tips
    let [arrowStart, arrowEnd] = [ArrowTipKind.NONE, ArrowTipKind.NONE];
    if (index === 0) {
      arrowStart = this.getArrowTip(this.modelElement.memberEnd[0]);
    } else if (isLastSegment) {
      arrowEnd = this.getArrowTip(this.modelElement.memberEnd[1]);
    }

    arrow(canvas.ctx, line, stroke, arrowEnd, arrowStart);
  }

  private getArrowTip(property: Property): ArrowTipKind {
    const aggregation = property.aggregation;
    switch (aggregation) {
      case AggregationKind.composite:
        return ArrowTipKind.DIAMOND_FILLED;
      case AggregationKind.shared:
        return ArrowTipKind.DIAMOND;
      default:
        return ArrowTipKind.NONE;
    }
  }
}
