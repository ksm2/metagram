import { Visitor } from './Visitor';
import { Point } from '../diagram/Point';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { XMIDecoder } from '../decoding/XMIDecoder';
import { Element } from '../models/Element';

export class PointVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
    return new Point();
  }

  visitAttr(decoder: XMIDecoder, name: string, value: string, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof Point)) return;

    switch (name) {
      case 'x': parent.x = parseInt(value, 10); return;
      case 'y': parent.y = parseInt(value, 10); return;
    }
  }
}
