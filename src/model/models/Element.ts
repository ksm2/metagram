import { Class, Attribute } from '../decorators';

@Class('Element')
export class Element {
  private _name: string | null = null;
  private _comments: Set<string> = new Set();
  private _ownedElements: Set<Element> = new Set();
  private _owningElement: Element | null = null;
  private _origin: string | undefined;
  private _ID: string | undefined;
  private _typeURI: string | undefined;
  private _typeName: string | undefined;

  @Attribute({ type: String, lower: 0 })
  get name(): string | null {
    return this._name;
  }

  set name(value: string | null) {
    this._name = value;
  }

  @Attribute({ type: String, lower: 0, upper: Infinity })
  get comments(): Set<string> {
    return this._comments;
  }

  set comments(value: Set<string>) {
    this._comments = value;
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
        if (element.getID() === id) return element;

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
   * Sets the element's typeURI
   */
  setTypeURI(typeURI: string | undefined) {
    this._typeURI = typeURI;
  }

  /**
   * Returns the URI of this element
   */
  getTypeURI(): string | undefined {
    return this._typeURI;
  }

  /**
   * Sets the element's type name
   */
  setTypeName(typeName: string | undefined) {
    this._typeName = typeName;
  }

  /**
   * Returns the type name of this element
   */
  getTypeName(): string | undefined {
    return this._typeName;
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
