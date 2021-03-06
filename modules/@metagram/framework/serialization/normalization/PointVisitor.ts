import { Point } from '../../diagram/Point';
import { Element } from '../../models';
import { ResolvedXMINode } from '../encoding/ResolvedXMINode';
import { XMIDecoder } from '../encoding/XMIDecoder';
import { Visitor } from './Visitor';

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
