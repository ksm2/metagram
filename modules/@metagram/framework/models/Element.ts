import { EventEmitter } from 'events';
import { Class } from '../decorators';

export interface ElementListener {
  (newValue: any, key: string): void;
}

@Class('Element')
export class Element extends EventEmitter {
  __typeName: string | undefined;
  __typeURI: string | undefined;
  private __contents = new Set<Element>();
  private __origin: string | undefined;
  private __ID: string | undefined;

  get contents(): Set<Element> {
    return this.__contents;
  }

  constructor() {
    super();
    this.setMaxListeners(200);
  }

  /**
   * Appends a child to this element
   */
  appendChild(child: Element): void {
    this.__contents.add(child);
  }

  /**
   * Removes a child from this element
   */
  removeChild(child: Element): boolean {
    return this.__contents.delete(child);
  }

  /**
   * Returns a hyper reference to this element
   */
  getHref(): string | undefined {
    return this.getOrigin() && `${this.getOrigin()}#${this.getID()}`;
  }

  /**
   * Sets the element's origin
   */
  setOrigin(origin: string) {
    this.__origin = origin;
  }

  /**
   * Returns the origin of this element
   */
  getOrigin(): string | undefined {
    return this.__origin;
  }

  /**
   * Sets the element's ID
   */
  setID(ID: string | undefined) {
    this.__ID = ID;
  }

  /**
   * Returns the ID of this element
   */
  getID(): string | undefined {
    return this.__ID;
  }

  /**
   * Sets the element's type URI
   */
  setTypeURI(uri: string | undefined) {
    this.__typeURI = uri;
  }

  /**
   * Returns the TypeURI of this element
   */
  getTypeURI(): string | undefined {
    return this.__typeURI;
  }

  /**
   * Sets the element's type name
   */
  setTypeName(name: string | undefined) {
    this.__typeName = name;
  }

  /**
   * Returns the TypeName of this element
   */
  getTypeName(): string | undefined {
    return this.__typeName;
  }

  /**
   * Merges elements with each other
   *
   * @param other The element to merge
   */
  merge(other: Element): this {
    other.contents.forEach((ownedElement) => {
      this.appendChild(ownedElement);
      other.removeChild(ownedElement);
    });
    return this;
  }
}
