import { Class, Attribute } from '../decorators';

@Class('Element')
export class Element {
  private _ID: string | null = null;
  private _name: string | null = null;
  private _comment: string | null;
  private _elements: Set<Element> = new Set();
  private _ownedElements: Set<Element> = new Set();

  @Attribute({ type: String, lower: 0 })
  get ID(): string | null {
    return this._ID;
  }

  set ID(value: string | null) {
    this._ID = value;
  }

  @Attribute({ type: String, lower: 0 })
  get name(): string | null {
    return this._name;
  }

  set name(value: string | null) {
    this._name = value;
  }

  @Attribute({ type: String, lower: 0 })
  get comment(): string | null {
    return this._comment;
  }

  set comment(value: string | null) {
    this._comment = value;
  }

  @Attribute({ type: Element, lower: 0, upper: Infinity })
  get ownedElements(): Set<Element> {
    return this._ownedElements;
  }

  set ownedElements(value: Set<Element>) {
    this._ownedElements = value;
  }

  [key: string]: any;

  [Symbol.iterator](): IterableIterator<Element> {
    return this._elements.values();
  }

  /**
   * Adds a child to this element
   */
  appendChild(child: Element): void {
    this._elements.add(child);
  }

  /**
   * Removes a child from this element
   */
  removeChild(child: Element): boolean {
    return this._elements.delete(child);
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
