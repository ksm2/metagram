import { Class, Attribute } from '../decorators';
import { ModelElement } from './uml/ModelElement';
import { strictEqual } from 'assert';

export interface ElementListener {
  (newValue: any, key: string): void;
}

@Class('Element')
export class Element {
  private _contents = new Set<Element>();
  private _origin: string | undefined;
  private _ID: string | undefined;
  private _instanceOf: ModelElement | undefined;
  private _listeners: Map<string, ElementListener[]> = new Map();

  get contents(): Set<Element> {
    return this._contents;
  }

  on(key: string, listener: ElementListener) {
    const listeners = this._listeners.get(key) || [];
    listeners.push(listener);
    this._listeners.set(key, listeners);
  }

  off(key: string) {
    this._listeners.delete(key);
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
   * Sets the element's type
   */
  setInstanceOf(type: ModelElement | undefined) {
    this._instanceOf = type;
  }

  /**
   * Returns the URI of this element
   */
  getInstanceOf(): ModelElement | undefined {
    return this._instanceOf;
  }

  /**
   * Emit a change on a property
   */
  protected emit(key: string, newValue: any): void {
    let listeners = this._listeners.get(key) || [];
    listeners = listeners.concat(this._listeners.get('*') || []);
    for (let listener of listeners) {
      listener(newValue, key);
    }
  }
}
