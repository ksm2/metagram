import { HRefLeaf } from './HRefLeaf';
import { IDRefLeaf } from './IDRefLeaf';
import { ResolvedXMINode } from './ResolvedXMINode';
import { StringLeaf } from './StringLeaf';
import { XMIElementNode } from './XMIElementNode';
import { XMINode } from './XMINode';
import { XMIResolver } from './XMIResolver';

const XMI_URI = 'http://www.omg.org/spec/XMI/20131001';

export class XMITree {
  root: XMIElementNode;

  constructor(public origin: string, xml: Element) {
    const parent = this.createTree(xml);
    if (!(parent instanceof XMIElementNode)) throw new Error(`Unexpected parent node type: ${parent && parent.constructor.name}`);

    this.root = parent;
  }

  /**
   * Resolves all hyper-references
   */
  async resolve(resolver: XMIResolver): Promise<ResolvedXMINode> {
    const resolveSet = new Set<XMIElementNode>();
    await this.resolveRefNodes(this.root, resolver, resolveSet);
    return ResolvedXMINode.createTree(this.root)!;
  }

  /**
   * Creates an XMI tree from an XML structure
   */
  private createTree(xml: Element): XMINode | null {
    const { id, idref, href } = this.extractXMIInfo(xml);

    // Check for idref
    if (idref) return new IDRefLeaf(this.origin, idref);

    // Check for href
    if (href) return new HRefLeaf(this.origin, href);

    // Check if can retrieve type or return string leaf
    try {
      const xmiType = this.getXMIType(xml);
      if (!xmiType) return new StringLeaf(this.origin, xml.tagName, xml.textContent || '');

      const [typeURI, typeName] = xmiType;

      // Is child node an element?
      const elements = Array.from(xml.childNodes).filter((childNode) => childNode.nodeType === 1) as Element[];

      // Resolve children
      const node = new XMIElementNode(this.origin, xml, typeURI, typeName, id);
      for (const element of elements) {
        const childrenOfTag = node.children.get(element.tagName) || [];
        const childNode = this.createTree(element);
        if (childNode) {
          childrenOfTag.push(childNode);
          node.children.set(element.tagName, childrenOfTag);
        }
      }

      return node;
    } catch (e) {
      console.warn(e);
      return null;
    }
  }

  private async resolveRefNodes(node: XMIElementNode, resolver: XMIResolver, visited: Set<XMIElementNode>): Promise<any> {
    visited.add(node);

    for (const children of node.children.values()) {
      for (let i = 0; i < children.length; i += 1) {
        const child = children[i];

        if (child instanceof IDRefLeaf) {
          const resolved = this.root.findNodeByID(child.idref);
          if (!(resolved instanceof XMIElementNode)) throw new Error(`Could not resolve xmi:idref="${child.idref}"`);

          if (!visited.has(resolved)) await this.resolveRefNodes(resolved, resolver, visited);
          children[i] = resolved;
          continue;
        }

        if (child instanceof HRefLeaf) {
          const resolved = await resolver.resolveURL(child.href);
          const nodeByID = resolved.getNodeByID(child.id);
          if (!nodeByID) throw new Error(`Could not resolve HRef: ${child.href}#${child.id}`);
          children[i] = nodeByID;
          continue;
        }

        if (child instanceof StringLeaf) {
          const keyAttrs = node.attrs.get(child.key) || [];
          keyAttrs.push(child.value);
          node.attrs.set(child.key, keyAttrs);
          children.splice(i, 1);
        }

        if (child instanceof XMIElementNode && !visited.has(child)) {
          await this.resolveRefNodes(child, resolver, visited);
        }
      }
    }
  }

  /**
   * Extracts XMI information from an XML element
   */
  private extractXMIInfo(element: Element): { id?: string; idref?: string; type?: string; name?: string; href?: string } {
    return {
      href: element.getAttribute('href') || '',
      id: element.getAttributeNS(XMI_URI, 'id'),
      idref: element.getAttributeNS(XMI_URI, 'idref'),
    };
  }

  private getXMIType(xml: Element): null | [string, string] {
    const elementType = xml.getAttributeNS(XMI_URI, 'type') || xml.tagName;

    const [prefix, name] = elementType.split(':');
    if (!name || !prefix) return null;

    const URI = xml.lookupNamespaceURI(prefix);
    if (!URI) throw new Error(`XMI document broken: does not specify prefix "${prefix}" in "${elementType}"`);

    return [URI, name];
  }
}
