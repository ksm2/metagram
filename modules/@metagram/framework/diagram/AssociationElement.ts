import { Association } from '@metagram/models';
import { AggregationKind } from '@metagram/models';
import { Property } from '@metagram/models';
import { Canvas } from '../canvas/Canvas';
import { Color } from './Color';
import { Edge } from './Edge';
import { Line } from './Line';
import { LineTip } from '../rendering/LineTip';

export class AssociationElement extends Edge<Association> {
  renderLineSegment(canvas: Canvas, line: Line, index: number, lastIndex: number): void {
    const isFirst = index === 0;
    const isLast = index === lastIndex;
    const isMid = index === ~~(lastIndex / 2);
    let stroke = this.stroke;
    if (this.hovered) {
      stroke = this.stroke.withStyle(Color.RED);
    }

    // Check arrow tips and end labels
    let [arrowStart, arrowEnd] = [LineTip.NONE, LineTip.NONE];
    if (isFirst) {
      arrowStart = this.getArrowTip(this.modelElement.memberEnd[0]);
    }
    if (isLast) {
      arrowEnd = this.getArrowTip(this.modelElement.memberEnd[1]);
    }

    canvas.drawLine(line, stroke, arrowEnd, arrowStart);
    if (isMid && this.label)
      canvas.labelLine(line, this.font, this.label);
    if (isFirst && this.sourceLabel)
      canvas.labelLine(line, this.font, this.sourceLabel, 25);
    if (isLast && this.targetLabel)
      canvas.labelLine(line, this.font, this.targetLabel, -25);
  }

  private getArrowTip(property: Property): LineTip {
    if (this.modelElement.ownedEnd.has(property)) {
      return LineTip.PEAK;
    }

    const aggregation = property.aggregation;
    switch (aggregation) {
      case AggregationKind.COMPOSITE:
        return LineTip.DIAMOND_FILLED;
      case AggregationKind.SHARED:
        return LineTip.DIAMOND;
      default:
        return LineTip.NONE;
    }
  }
}
