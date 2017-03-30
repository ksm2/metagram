import { EventEmitter } from 'events';
import { Class } from '../decorators';
import { ModelElement } from './uml/ModelElement';

export interface ElementListener {
  (newValue: any, key: string): void;
}

@Class('Element')
export class Element extends EventEmitter {
  _typeName: string | undefined;
  _typeURI: string | undefined;
  private _contents = new Set<Element>();
  private _origin: string | undefined;
  private _ID: string | undefined;

  get contents(): Set<Element> {
    return this._contents;
  }

  constructor() {
    super();
    this.setMaxListeners(200);
  }

  /**
   * Appends a child to this element
   */
  appendChild(child: Element): void {
    this._contents.add(child);
  }

  /**
   * Removes a child from this element
   */
  removeChild(child: Element): boolean {
    return this._contents.delete(child);
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
    this._origin = origin;
  }

  /**
   * Returns the origin of this element
   */
  getOrigin(): string | undefined {
    return this._origin;
  }

  /**
   * Sets the element's ID
   */
  setID(ID: string | undefined) {
    this._ID = ID;
  }

  /**
   * Returns the ID of this element
   */
  getID(): string | undefined {
    return this._ID;
  }

  /**
   * Sets the element's type URI
   */
  setTypeURI(uri: string | undefined) {
    this._typeURI = uri;
  }

  /**
   * Returns the TypeURI of this element
   */
  getTypeURI(): string | undefined {
    return this._typeURI;
  }

  /**
   * Sets the element's type name
   */
  setTypeName(name: string | undefined) {
    this._typeName = name;
  }

  /**
   * Returns the TypeName of this element
   */
  getTypeName(): string | undefined {
    return this._typeName;
  }
}
