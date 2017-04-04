import { Diagram } from '../diagram/Diagram';
import { NodeCanvas } from './NodeCanvas';

export class PDFCanvas extends NodeCanvas {
  constructor(diagram: Diagram, zoom: number = 1) {
    super(diagram, zoom, 'pdf');
  }
}
