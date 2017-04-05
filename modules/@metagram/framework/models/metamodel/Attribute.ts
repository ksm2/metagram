import {
  ArbitraryAmbiguousCollection, ArbitraryUniqueCollection,
  List, OrderedAmbiguousCollection, OrderedList, OrderedSet,
  OrderedUniqueCollection
} from './Collections';

export class Attribute<T> {
  constructor(
    private _name: string,
    private _ordered: boolean,
    private _unique: boolean,
    private _lower: number,
    private _upper: number,
    private _items: T[] = [],
  ) {
  }

  [Symbol.iterator]() {
    return this.iterator;
  }

  get name(): string {
    return this._name;
  }

  get ordered(): boolean {
    return this._ordered;
  }

  get unique(): boolean {
    return this._unique;
  }

  get lower(): number {
    return this._lower;
  }

  get upper(): number {
    return this._upper;
  }

  get iterator(): IterableIterator<T> {
    return this._items[Symbol.iterator]();
  }

  get count(): number {
    return this._items.length;
  }

  isNotEmpty(): boolean {
    return !!this._items.length;
  }

  includes(item: T): boolean {
    return this._items.indexOf(item) >= 0;
  }

  append(item: T): boolean {
    if (this._unique && this.includes(item)) return false;
    if (this.count === this._upper) return false;

    this._items.push(item);
    return true;
  }

  remove(item: T): boolean {
    const index = this._items.indexOf(item);
    if (index < 0) return false;
    if (this.count === this._lower) return false;

    this._items.splice(index, 1);
    return true;
  }

  asSet(): ArbitraryUniqueCollection<T> {
    return new Set(this._items);
  }

  asList(): ArbitraryAmbiguousCollection<T> {
    return new List(this._items);
  }

  asOrderedSet(): OrderedUniqueCollection<T> {
    return new OrderedSet(this._items);
  }

  asOrderedList(): OrderedAmbiguousCollection<T> {
    return new OrderedList(this._items);
  }

  set(value: T | undefined): boolean {
    if (value) {
      if (this._lower > 1 || this._upper < 1) return false;
      this._items = [value];
    } else {
      if (this._lower > 0) return false;
      this._items = [];
    }
    return true;
  }

  first(): T | undefined {
    if (!this._ordered) return;
    if (!this._items.length) return;
    return this._items[0];
  }

  last(): T | undefined {
    if (!this._ordered) return;
    if (!this._items.length) return;
    return this._items[this._items.length - 1];
  }

  get(): T | undefined {
    if (this._items.length === 1) return this._items[0];
    return;
  }

  map<U>(cb: (item: T, index: number) => U): U[] {
    return this._items.map(cb);
  }

  filter(cb: (item: T, index: number) => boolean): Attribute<T> {
    return new Attribute(this._name, this._ordered, this._unique, this._lower, this._upper, this._items.filter(cb));
  }
}
