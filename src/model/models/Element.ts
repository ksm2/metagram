import { Class, Attribute } from '../decorators';

@Class('Element')
export class Element {
  private _ID: string;
  private _name: string;
  private _comment: string;

  @Attribute({ type: String, lower: 0 })
  get ID(): string {
    return this._ID;
  }

  set ID(value: string) {
    this._ID = value;
  }

  @Attribute({ type: String })
  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  @Attribute({ type: String, lower: 0 })
  get comment(): string {
    return this._comment;
  }

  set comment(value: string) {
    this._comment = value;
  }

  [key: string]: any;
  private _children: Set<Element>;

  constructor() {
    Object.defineProperty(this, '_children', {
      writable: false,
      enumerable: false,
      value: new Set(),
    });
  }

  [Symbol.iterator](): IterableIterator<Element> {
    return this._children.values();
  }

  /**
   * Adds a child to this element
   */
  appendChild(child: Element): void {
    this._children.add(child);
  }

  /**
   * Removes a child from this element
   */
  removeChild(child: Element): boolean {
    return this._children.delete(child);
  }

  /**
   * Returns all children
   */
  getChildren(): Set<Element> {
    return this._children;
  }

  /**
   * Gets an XMI element by its XMI ID.
   *
   * @param id The ID to look for
   * @returns The found element or null
   */
  getElementByID(id: string): Element | null {
    const q: Element[] = [this];
    while (q.length) {
      const element = q.shift();
      if (element instanceof Element) {
        // Check if we found the result
        if (element.ID === id) return element;

        // Add child elements to look up queue
        for (let child of element) {
          q.push(child);
        }
      }
    }

    return null;
  }
}
