import { Canvas } from '../canvas/Canvas';
import { Generalization } from '../models';
import { LineTip } from '../rendering/LineTip';
import { Color } from './Color';
import { Edge } from './Edge';
import { Line } from './Line';

export class GeneralizationElement extends Edge<Generalization> {
  renderLineSegment(canvas: Canvas, line: Line, index: number, lastIndex: number): void {
    let stroke = this.stroke;
    if (this.hovered) {
      stroke = this.stroke.withStyle(Color.RED);
    }

    canvas.drawLine(line, stroke, index === lastIndex ? LineTip.TRIANGLE : LineTip.NONE, LineTip.NONE);
  }
}
