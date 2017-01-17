import { Class, Attribute } from '../decorators';

@Class('Element')
export class Element {
  private _ID: string | null = null;
  private _name: string | null = null;
  private _comment: string | null;
  private _ownedElements: Set<Element> = new Set();
  private _owningElement: Element | null = null;
  private _origin: string | undefined;

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

  @Attribute({ type: Element, lower: 0 })
  get owningElement(): Element | null {
    return this._owningElement;
  }

  set owningElement(value: Element | null) {
    this._owningElement = value;
  }

  [key: string]: any;

  [Symbol.iterator](): IterableIterator<Element> {
    return this._ownedElements.values();
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

  /**
   * Returns a hyper reference to this element
   */
  getHref(): string | undefined {
    return this.getOrigin() && `${this.getOrigin()}#${this.ID}`;
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
   * Returns the hierarchy of all owning elements
   * (not UML-official.)
   */
  allOwningElements(): Element[] {
    if (null === this._owningElement) {
      return [];
    }

    return this._owningElement.allOwningElements().concat([this._owningElement]);
  }
}
