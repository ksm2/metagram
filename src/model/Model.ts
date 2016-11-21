import { ModelElement } from './ModelElement';
import { NamespaceObject, ModelObject } from '../loaders/AbstractLoader';
import { ModelNamespace } from './ModelNamespace';

export class Model {
  private idMap: Map<string, ModelElement>;
  private namespaces: Map<string, ModelNamespace>;
  private elements: Set<ModelElement>;

  constructor(data: ModelObject) {
    this.idMap = new Map();

    this.setNamespaces(data.namespaces);
    this.elements = new Set(data.content.map(datum => ModelElement.fromData(this, datum)));
  }

  /**
   * Sets an elements ID
   */
  setElementById(id: string, element: ModelElement) {
    this.idMap.set(id, element);
  }

  /**
   * Returns an element by its ID
   */
  getElementById(id: string): ModelElement | undefined {
    return this.idMap.get(id);
  }

  /**
   * Returns all elements
   */
  getElements(): Set<ModelElement> {
    return this.elements;
  }

  /**
   * Sets a specific namespace for a prefix
   */
  setNamespace(prefix: string, namespace: ModelNamespace): void {
    this.namespaces.set(prefix, namespace);
  }

  /**
   * Gets the specific namespace for a prefix
   */
  getNamespace(prefix: string): ModelNamespace {
    const ns = this.namespaces.get(prefix);
    if (!ns) throw `Namespace prefix unknown: ${prefix}`;
    return ns;
  }

  /**
   * Overwrites all known namespaces to this model
   */
  setNamespaces(namespaces: NamespaceObject): void {
    this.namespaces = new Map(namespaces.map(([prefix, uri]) => [prefix, new ModelNamespace(uri)] as [string, ModelNamespace]));
  }

  /**
   * Returns all set namespaces
   */
  getNamespaces(): NamespaceObject {
    return Array.from(this.namespaces).map(([prefix, ns]) => [prefix, ns.getURI()] as [string, string]);
  }
}
