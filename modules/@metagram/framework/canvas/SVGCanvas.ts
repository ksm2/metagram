import { NodeCanvas } from './NodeCanvas';
import { Diagram } from '../diagram/Diagram';

export class SVGCanvas extends NodeCanvas {
  constructor(diagram: Diagram, zoom: number = 1) {
    const dim = diagram.calcAllElementBounds();
    super(zoom * dim.width, zoom * dim.height, 'svg');
    this.moveOffset(-dim.x, -dim.y);
    this.zoom = zoom;
    this.diagram = diagram;
  }
}
