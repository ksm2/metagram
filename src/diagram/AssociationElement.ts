import { Association } from '../models';
import { arrow, ArrowTipKind } from '../rendering';
import { Canvas } from '../canvas/Canvas';
import { Color } from './Color';
import { Edge } from './Edge';
import { Line } from './Line';
import { AggregationKind } from '../models/uml/AggregationKind';
import { Property } from '../models/uml/Property';

export class AssociationElement extends Edge<Association> {
  renderLineSegment(canvas: Canvas, line: Line, index: number, isLast: boolean): void {
    const isFirst = index === 0;
    let stroke = this.stroke;
    if (this.hovered) {
      stroke = this.stroke.withStyle(Color.RED);
    }

    // Check arrow tips and end labels
    let [arrowStart, arrowEnd] = [ArrowTipKind.NONE, ArrowTipKind.NONE];
    if (isFirst) {
      arrowStart = this.getArrowTip(this.modelElement.memberEnd[0]);
    }
    if (isLast) {
      arrowEnd = this.getArrowTip(this.modelElement.memberEnd[1]);
    }

    arrow(canvas.ctx, line, stroke, arrowEnd, arrowStart, this.font, this.label, isFirst ? this.sourceLabel : null, isLast ? this.targetLabel : null);
  }

  private getArrowTip(property: Property): ArrowTipKind {
    if (this.modelElement.ownedEnd.has(property)) {
      return ArrowTipKind.PEAK;
    }

    const aggregation = property.aggregation;
    switch (aggregation) {
      case AggregationKind.COMPOSITE:
        return ArrowTipKind.DIAMOND_FILLED;
      case AggregationKind.SHARED:
        return ArrowTipKind.DIAMOND;
      default:
        return ArrowTipKind.NONE;
    }
  }
}
