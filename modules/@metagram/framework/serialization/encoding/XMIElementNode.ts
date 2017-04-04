import { XMINode } from './XMINode';

export class XMIElementNode extends XMINode {
  attrs: Map<string, string[]>;
  tagName: string;
  children: Map<string, XMINode[]>;

  constructor(origin: string, xmlElement: Element, public typeURI: string, public typeName: string, public id?: string) {
    super(origin);
    this.children = new Map();
    this.attrs = new Map();
    this.tagName = xmlElement.tagName;
    for (let i = 0; i < xmlElement.attributes.length; i += 1) {
      const attr = xmlElement.attributes.item(i);
      if (attr.name.indexOf('xmi:') === 0) continue;

      this.attrs.set(attr.name, [attr.value]);
    }
  }

  findNodeByID(id: string): XMIElementNode | null {
    const queue: XMIElementNode[] = [this];
    while (queue.length) {
      const node = queue.shift()!;
      if (node.id === id) return node;

      for (const children of node.children.values()) {
        for (const child of children) {
          if (child instanceof XMIElementNode) {
            queue.push(child);
          }
        }
      }
    }

    return null;
  }

}
