import { Visitor } from './Visitor';
import { Bounds } from '../diagram/Bounds';
import { ResolvedXMINode } from '../decoding/ResolvedXMINode';
import { XMIDecoder } from '../decoding/XMIDecoder';
import { Element } from '../models/Element';

export class BoundsVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
    return new Bounds();
  }

  visitAttr(decoder: XMIDecoder, name: string, value: string, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof Bounds)) return;

    switch (name) {
      case 'x': parent.x = parseInt(value, 10) * 18 / 300; return;
      case 'y': parent.y = parseInt(value, 10) * 18 / 300; return;
      case 'width': parent.width = parseInt(value, 10) * 18 / 300; return;
      case 'height': parent.height = parseInt(value, 10) * 18 / 300; return;
    }
  }
}
