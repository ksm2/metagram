import { NodeCanvas } from './NodeCanvas';
import { Diagram } from '../diagram/Diagram';

export class PDFCanvas extends NodeCanvas {
  constructor(diagram: Diagram, zoom: number = 1) {
    super(diagram, zoom, 'pdf');
  }
}
