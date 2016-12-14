import { Entity } from './Entity';
import { NamespaceObject, ModelDocumentObject } from '../encoders';
import { ModelNamespace } from './ModelNamespace';

export class Model {
  private idMap: Map<string, Entity>;
  private namespaces: Map<string, ModelNamespace>;
  private elements: Set<Entity>;

  constructor() {
    this.idMap = new Map();
    this.elements = new Set();
  }

  /**
   * Sets an elements ID
   */
  setElementById(id: string, element: Entity) {
    this.idMap.set(id, element);
  }

  /**
   * Unsets an elements ID
   */
  unsetElementById(id: string) {
    this.idMap.delete(id);
  }

  /**
   * Returns an element by its ID
   */
  getElementById(id: string): Entity | undefined {
    return this.idMap.get(id);
  }

  /**
   * Returns all elements
   */
  getElements(): Set<Entity> {
    return this.elements;
  }

  /**
   * Adds an element to this model
   */
  addElement(entity: Entity): void {
    this.elements.add(entity);
  }

  /**
   * Deletes an element from this model
   */
  deleteElement(entity: Entity): boolean {
    return this.elements.delete(entity);
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
   * Overwrites all known namespaces to this _model
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
