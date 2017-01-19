import { XMIElementNode, XMINode } from './XMINode';

export class ResolvedXMINode extends XMINode {
  parent: ResolvedXMINode | null;
  tagName: string;
  id: string | undefined;
  typeURI: string;
  typeName: string;
  attrs: Map<string, string[]>;
  elements: Map<string, ResolvedXMINode[]>;

  constructor(unresolvedNode: XMIElementNode, parent?: ResolvedXMINode) {
    super(unresolvedNode.origin);
    this.parent = parent || null;
    this.tagName = unresolvedNode.tagName;
    this.id = unresolvedNode.id;
    this.typeURI = unresolvedNode.typeURI;
    this.typeName = unresolvedNode.typeName;
    this.attrs = unresolvedNode.attrs;
    this.elements = new Map();
  }

  /**
   * Creates a resolved tree from an unresolved XMI element node
   */
  static createTree(unresolvedNode: XMINode, parent?: ResolvedXMINode, weakMap?: WeakMap<XMINode, ResolvedXMINode>): ResolvedXMINode | null {
    // Directly return resolved node
    if (unresolvedNode instanceof ResolvedXMINode) return unresolvedNode;

    // Check if is already in weak map
    if (!weakMap) weakMap = new WeakMap();
    if (weakMap.has(unresolvedNode)) return weakMap.get(unresolvedNode)!;

    // Create new unresolved node from element node
    if (unresolvedNode instanceof XMIElementNode) {
      const node = new ResolvedXMINode(unresolvedNode, parent);
      weakMap.set(unresolvedNode, node);

      for (let [tagName, children] of unresolvedNode.children) {
        for (let child of children) {
          const resolved = ResolvedXMINode.createTree(child, node, weakMap);
          if (!resolved) throw 'The tree is not fully resolved';

          const elements = node.elements.get(tagName) || [];
          elements.push(resolved);
          node.elements.set(tagName, elements);
        }
      }

      return node;
    }

    return null;
  }

  getRoot(): ResolvedXMINode {
    if (this.parent) return this.parent.getRoot();
    return this;
  }

  getNodeByID(id: string): XMINode | null {
    const visited = new Set<ResolvedXMINode>();
    const queue: ResolvedXMINode[] = [this.getRoot()];
    while (queue.length) {
      const node = queue.shift()!;
      visited.add(node);
      if (node.id === id) return node;

      for (let child of node.getAllChildren()) {
        if (child instanceof ResolvedXMINode && !visited.has(child)) {
          queue.push(child);
        }
      }
    }

    return null;
  }

  has(key: string): boolean {
    return this.attrs.has(key) || this.elements.has(key);
  }

  get(key: string): string[] | ResolvedXMINode[] | null {
    return this.attrs.get(key) || this.elements.get(key) || null;
  }

  getString(key: string): string | null {
    const atKey = this.attrs.get(key);
    if (atKey && atKey.length) return atKey[0];

    return null;
  }

  getAllChildren(): ResolvedXMINode[] {
    return Array.prototype.concat.apply([], [...this.elements.values()]);
  }
}
