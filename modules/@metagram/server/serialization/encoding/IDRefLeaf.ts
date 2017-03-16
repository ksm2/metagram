import { XMINode } from './XMINode';

export class IDRefLeaf extends XMINode {
  constructor(origin: string, public idref: string) {
    super(origin);
  }
}
