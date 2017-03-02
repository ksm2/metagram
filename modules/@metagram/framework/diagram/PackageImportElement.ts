import { PackageImport } from '@metagram/models';
import { Canvas } from '../canvas/Canvas';
import { Color } from './Color';
import { Edge } from './Edge';
import { Line } from './Line';
import { LineTip } from '../rendering/LineTip';

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

    canvas.drawLine(line, stroke, LineTip.NONE, LineTip.NONE);
  }
}
