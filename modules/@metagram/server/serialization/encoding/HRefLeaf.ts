import { XMINode } from './XMINode';

export class HRefLeaf extends XMINode {
  href: string;
  id: string;

  constructor(origin: string, href: string) {
    super(origin);
    [this.href, this.id] = href.split('#');
    if (!this.href || !this.id) throw new Error(`HRef is broken: ${href}`);
  }
}
