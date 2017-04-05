export interface Collection<T> {
  readonly size: number;
  [Symbol.iterator](): IterableIterator<T>;
  has(value: T): boolean;
}

export interface OrderedCollection<T> extends Collection<T> {
  forEach(callbackfn: (value: T, index: number, collection: Collection<T>) => void, thisArg?: any): void;
  first(): T | undefined;
  last(): T | undefined;
}

export interface ArbitraryCollection<T> extends Collection<T> {
  forEach(callbackfn: (value1: T, value2: T, collection: Collection<T>) => void, thisArg?: any): void;
}

export interface ArbitraryUniqueCollection<T> extends ArbitraryCollection<T> {
}

export interface ArbitraryAmbiguousCollection<T> extends ArbitraryCollection<T> {
}

export interface OrderedAmbiguousCollection<T> extends OrderedCollection<T> {
  indexOf(item: T, fromIndex?: number): number;
  lastIndexOf(item: T): number;
  indicesOf(item: T): number[];
}

export interface OrderedUniqueCollection<T> extends OrderedCollection<T> {
  indexOf(item: T): number;
}

export class OrderedSet<T> implements OrderedUniqueCollection<T> {
  constructor(private _items: T[]) {
  }

  get size(): number {
    return this._items.length;
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this._items[Symbol.iterator]();
  }

  indexOf(item: T): number {
    return this._items.indexOf(item);
  }

  first(): undefined | T {
    return this._items[0];
  }

  last(): undefined | T {
    return this._items[this._items.length - 1];
  }

  has(value: T): boolean {
    return this._items.indexOf(value) >= 0;
  }

  forEach(callbackfn: (value: T, index: number, collection: Collection<T>) => void, thisArg?: any): void {
    this._items.forEach((value, index) => callbackfn(value, index, this), thisArg);
  }
}

export class List<T> implements ArbitraryAmbiguousCollection<T> {
  constructor(private _items: T[]) {
  }

  get size(): number {
    return this._items.length;
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this._items[Symbol.iterator]();
  }

  has(value: T): boolean {
    return this._items.indexOf(value) >= 0;
  }

  forEach(callbackfn: (value1: T, value2: T, collection: Collection<T>) => void, thisArg?: any): void {
    this._items.forEach((value) => callbackfn(value, value, this), thisArg);
  }
}

export class OrderedList<T> implements OrderedAmbiguousCollection<T> {
  constructor(private _items: T[]) {
  }

  get size(): number {
    return this._items.length;
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this._items[Symbol.iterator]();
  }

  first(): undefined | T {
    return this._items[0];
  }

  last(): undefined | T {
    return this._items[this._items.length - 1];
  }

  has(value: T): boolean {
    return this._items.indexOf(value) >= 0;
  }

  forEach(callbackfn: (value: T, index: number, collection: Collection<T>) => void, thisArg?: any): void {
    this._items.forEach((value, index) => callbackfn(value, index, this), thisArg);
  }

  indexOf(item: T, fromIndex?: number): number {
    return this._items.indexOf(item, fromIndex);
  }

  lastIndexOf(item: T): number {
    return this._items.lastIndexOf(item);
  }

  indicesOf(item: T): number[] {
    const ii = [];
    let i = this._items.indexOf(item);
    while (i >= 0) {
      ii.push(i);
      i = this._items.indexOf(item, i + 1);
    }

    return ii;
  }
}
