import { NodeCanvas } from './NodeCanvas';
import { Diagram } from '../diagram/Diagram';

export class SVGCanvas extends NodeCanvas {
  constructor(diagram: Diagram, zoom: number = 1) {
    super(diagram, zoom, 'svg');
  }
}
