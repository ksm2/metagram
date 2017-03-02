
export class XMINode {
  constructor(public origin: string) {
  }
}

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
      const attr = xmlElement.attributes[i];
      if (attr.name.indexOf('xmi:') === 0) continue;

      this.attrs.set(attr.name, [attr.value]);
    }
  }

  findNodeByID(id: string): XMIElementNode | null {
    const queue: XMIElementNode[] = [this];
    while (queue.length) {
      const node = queue.shift()!;
      if (node.id === id) return node;

      for (let children of node.children.values()) {
        for (let child of children) {
          if (child instanceof XMIElementNode) {
            queue.push(child);
          }
        }
      }
    }

    return null;
  }

}

export class StringLeaf extends XMINode {
  constructor(origin: string, public key: string, public value: string) {
    super(origin);
  }
}

export class IDRefLeaf extends XMINode {
  constructor(origin: string, public idref: string) {
    super(origin);
  }
}

export class HRefLeaf extends XMINode {
  href: string;
  id: string;

  constructor(origin: string, href: string) {
    super(origin);
    [this.href, this.id] = href.split('#');
    if (!this.href || !this.id) throw new Error(`HRef is broken: ${href}`);
  }
}
