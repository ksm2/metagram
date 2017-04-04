import { Attribute, Class } from '../../decorators';
import { Element } from '../Element';
import { VisibilityKind } from './VisibilityKind';

@Class(ModelElement, Element)
export class ModelElement extends Element {
  private _name: string | null = null;
  private _visibility: string = VisibilityKind.PUBLIC;
  private _comments: Set<string> = new Set();
  private _ownedElements: Set<ModelElement> = new Set();
  private _owningElement: ModelElement | null = null;

  @Attribute({ type: String, lower: 0 })
  get name(): string | null {
    return this._name;
  }

  set name(value: string | null) {
    this._name = value;
    this.emit('name', value);
  }

  @Attribute({ type: VisibilityKind })
  get visibility(): string {
    return this._visibility;
  }

  set visibility(value: string) {
    this._visibility = value;
  }

  @Attribute({ type: String, lower: 0, upper: Infinity })
  get comments(): Set<string> {
    return this._comments;
  }

  set comments(value: Set<string>) {
    this._comments = value;
  }

  @Attribute({ type: ModelElement, lower: 0, upper: Infinity })
  get ownedElements(): Set<ModelElement> {
    return this._ownedElements;
  }

  set ownedElements(value: Set<ModelElement>) {
    this._ownedElements = value;
  }

  @Attribute({ type: ModelElement, lower: 0 })
  get owningElement(): ModelElement | null {
    return this._owningElement;
  }

  set owningElement(value: ModelElement | null) {
    this._owningElement = value;
  }

  [key: string]: any;

  [Symbol.iterator](): IterableIterator<ModelElement> {
    return this._ownedElements.values();
  }

  /**
   * Returns the hierarchy of all owning elements
   * (not UML-official.)
   */
  allOwningElements(): ModelElement[] {
    if (null === this._owningElement) {
      return [];
    }

    return this._owningElement.allOwningElements().concat([this._owningElement]);
  }

  /**
   * Returns the root model element
   */
  getRoot(): ModelElement {
    if (!this._owningElement) return this;
    return this._owningElement.getRoot();
  }
}
