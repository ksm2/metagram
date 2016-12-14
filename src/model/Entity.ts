import { Model } from './Model';
import { ModelElementObject } from './Interfaces';

export class Entity {
  protected _model: Model;
  private _id: string;
  private _type: string;
  private _ns: string;
  private _elements: Map<string, string | Entity[] | string[]>;
  private _content: Set<Entity>;

  constructor(model: Model) {
    this._model = model;
    this._elements = new Map();
    this._content = new Set();
  }

  getData(): ModelElementObject {
    const id = this._id;
    const type = this._type;
    const ns = this._ns;
    const object: ModelElementObject = { id, type, ns, el: {} };
    this._elements.forEach((value, key) => {
      let datum: any = value;
      if (datum instanceof Array) {
        datum = datum.map(it => it.getData());
      }
      object.el[key] = datum;
    });

    if (this._content.size) {
      object.content = Array.from(this._content).map(it => it.getData());
    }

    return object;
  }

  setID(id: string): void {
    if (this._id) {
      this._model.unsetElementById(this._id);
    }
    this._id = id;
    if (this._id) {
      this._model.setElementById(this._id, this);
    }
  }

  getID(): string {
    return this._id;
  }

  setNamespace(ns: string): void {
    this._ns = ns;
  }

  getNamespace(): string {
    return this._ns;
  }

  setType(type: string): void {
    this._type = type;
  }

  getType(): string {
    return this._type;
  }

  has(key: string): boolean {
    return this._elements.has(key);
  }

  set(key: string, value: string | string[] | Entity[] | undefined): void {
    if (typeof value == 'undefined') {
      this._elements.delete(key);
      return;
    }
    this._elements.set(key, value);
  }

  setString(key: string, value?: string): void {
    this._elements.set(key, value);
  }

  getString(key: string, defaultValue?: string): string | undefined {
    if (!this.has(key)) return defaultValue;

    const value = this._elements.get(key);
    return typeof value == 'string' ? value : defaultValue;
  }

  setStrings(key: string, value?: string[]): void {
    this._elements.set(key, value);
  }

  getStrings(key: string, defaultValue: string[] = []): string[] | undefined {
    if (!this.has(key)) return defaultValue;

    const value = this._elements.get(key);
    return (value instanceof Array) ? value as string[] : defaultValue;
  }

  setBoolean(key: string, value?: boolean): void {
    this.setString(key, value === true ? 'true' : value === false ? 'false' : void 0);
  }

  getBoolean(key: string, defaultValue?: boolean): boolean | undefined {
    const value = this.getString(key);
    return value === 'true' ? true : value === 'false' ? false : defaultValue;
  }

  setBooleans(key: string, value?: boolean[]): void {
    this.setStrings(key, value && value.map(_ => _ === true ? 'true' : 'false'));
  }

  getBooleans(key: string, defaultValue?: boolean[]): boolean[] | undefined {
    const value = this.getStrings(key);
    if (!value) {
      return defaultValue;
    }
    return value.map(_ => _ === 'true' ? true : false);
  }

  setFloat(key: string, value?: number): void {
    this.setString(key, (typeof value == 'number') ? value + '' : void 0);
  }

  getFloat(key: string, defaultValue?: number): number | undefined {
    const value = parseFloat(this.getString(key) || '');
    return isNaN(value) ? defaultValue : value;
  }

  setInteger(key: string, value?: number): void {
    this.setString(key, (typeof value == 'number') ? value + '' : void 0);
  }

  getInteger(key: string, defaultValue?: number): number | undefined {
    const value = parseInt(this.getString(key) || '', 10);
    return isNaN(value) ? defaultValue : value;
  }

  setEnum(key: string, value?: number): void {
    this.setString(key, (typeof value == 'number') ? value + '' : void 0);
  }

  getEnum(key: string, defaultValue?: number): number | undefined {
    const value = parseInt(this.getString(key) || '', 10);
    return isNaN(value) ? defaultValue : value;
  }

  setElement<T extends Entity>(key: string, value?: T | undefined ): void {
    return this.set(key, value && [value]);
  }

  getElement<T extends Entity>(key: string, defaultValue?: T): T | undefined {
    const values = this.getElements(key);
    return values.length >= 1 ? values[0] as T : defaultValue;
  }

  setElements<T extends Entity>(key: string, value?: T[] | undefined ): void {
    return this.set(key, value);
  }

  getElements<T extends Entity>(key: string, defaultValue: T[] = []): T[] {
    if (!this.has(key)) return defaultValue;
    const value = this._elements.get(key);

    return value instanceof Array ? value as T[] : defaultValue;
  }
}
