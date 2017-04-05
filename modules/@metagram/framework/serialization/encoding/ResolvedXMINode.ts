import { XMIElementNode } from './XMIElementNode';
import { XMINode } from './XMINode';

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
  static createTree(node: XMINode, parent?: ResolvedXMINode, weakMap?: WeakMap<XMINode, ResolvedXMINode>): ResolvedXMINode | null {
    // Directly return resolved node
    if (node instanceof ResolvedXMINode) return node;

    // Check if is already in weak map
    if (!weakMap) weakMap = new WeakMap();
    if (weakMap.has(node)) return weakMap.get(node)!;

    // Create new unresolved node from element node
    if (node instanceof XMIElementNode) {
      const resolvedNode = new ResolvedXMINode(node, parent);
      weakMap.set(node, resolvedNode);

      for (const [tagName, children] of node.children) {
        for (const child of children) {
          const resolved = ResolvedXMINode.createTree(child, resolvedNode, weakMap);
          if (!resolved) throw new Error('The tree is not fully resolved');

          const elements = resolvedNode.elements.get(tagName) || [];
          elements.push(resolved);
          resolvedNode.elements.set(tagName, elements);
        }
      }

      return resolvedNode;
    }

    return null;
  }

  getRoot(): ResolvedXMINode {
    if (this.parent) return this.parent.getRoot();
    return this;
  }

  getNodeByID(id: string): XMINode | null {
    return this.getRoot().getChildNodeByID(id);
  }

  getChildNodeByID(id: string): XMINode | null {
    const visited = new Set<ResolvedXMINode>();
    const queue: ResolvedXMINode[] = [this];
    while (queue.length) {
      const node = queue.shift()!;
      visited.add(node);
      if (node.id === id) return node;

      for (const child of node.getAllChildren()) {
        if (child instanceof ResolvedXMINode && !visited.has(child)) {
          queue.push(child);
        }
      }
    }

    return null;
  }

  getNodeByName(name: string): XMINode | null {
    return this.getRoot().getChildNodeByName(name);
  }

  getChildNodeByName(name: string): XMINode | null {
    const visited = new Set<ResolvedXMINode>();
    const queue: ResolvedXMINode[] = [this];
    while (queue.length) {
      const node = queue.shift()!;
      visited.add(node);
      if (node.getString('name') === name) return node;

      for (const child of node.getAllChildren()) {
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

  getElement(key: string): ResolvedXMINode | null {
    const at = this.elements.get(key);
    return at && at.length && at[0] || null;
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
