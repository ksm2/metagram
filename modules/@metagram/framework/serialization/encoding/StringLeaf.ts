import { XMINode } from './XMINode';

export class StringLeaf extends XMINode {
  constructor(origin: string, public key: string, public value: string) {
    super(origin);
  }
}
