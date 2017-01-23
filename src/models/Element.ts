import { Class, Attribute } from '../decorators';

@Class('Element')
export class Element {
  private _origin: string | undefined;
  private _ID: string | undefined;
  private _typeURI: string | undefined;
  private _typeName: string | undefined;

  [key: string]: any;

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
}
