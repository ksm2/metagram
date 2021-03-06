import { Bounds } from '../../diagram/Bounds';
import { Element } from '../../models';
import { ResolvedXMINode } from '../encoding/ResolvedXMINode';
import { XMIDecoder } from '../encoding/XMIDecoder';
import { Visitor } from './Visitor';

export class BoundsVisitor extends Visitor {
  createInstance(node: ResolvedXMINode): Element {
    return new Bounds();
  }

  visitAttr(decoder: XMIDecoder, name: string, value: string, parent: Element, parentNode: ResolvedXMINode): void {
    if (!(parent instanceof Bounds)) return;

    switch (name) {
      case 'x': parent.x = parseInt(value, 10); return;
      case 'y': parent.y = parseInt(value, 10); return;
      case 'width': parent.width = parseInt(value, 10); return;
      case 'height': parent.height = parseInt(value, 10); return;
    }
  }
}
