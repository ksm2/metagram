import { Model } from './Model';
import { ModelElementObject } from '../encoders';

export class Entity {
  protected _model: Model;
  private _id: string;
  private _type: string;
  private _ns: string;
  private _elements: Map<string, string | Entity[]>;
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

  set(key: string, value: string | Entity[]): void {
    this._elements.set(key, value);
  }

  getString(key: string, defaultValue?: string): string | undefined {
    if (!this.has(key)) return defaultValue;

    const value = this._elements.get(key);
    return typeof value == 'string' ? value : defaultValue;
  }

  getFloat(key: string, defaultValue?: number): number | undefined {
    const value = parseFloat(this.getString(key) || '');
    return isNaN(value) ? defaultValue : value;
  }

  getInt(key: string, defaultValue?: number): number | undefined {
    const value = parseInt(this.getString(key) || '', 10);
    return isNaN(value) ? defaultValue : value;
  }

  getElement(key: string, defaultValue?: Entity): Entity | undefined {
    const values = this.getElements(key);
    return values.length >= 1 ? values[0] : defaultValue;
  }

  getElements(key: string, defaultValue: Entity[] = []): Entity[] {
    if (!this.has(key)) return defaultValue;
    const value = this._elements.get(key);

    return value instanceof Array ? value : defaultValue;
  }
}

export function fromData(model: Model, data: ModelElementObject): Entity {
  let type: any = Entity;
  const element = new type(model);
  if (data.id) {
    element.setID(data.id);
  }
  element.setNamespace(data.ns);
  element.setType(data.type);

  Object.getOwnPropertyNames(data.el).forEach((k) => {
    let datum: string | ModelElementObject[] = data.el[k];
    if (datum instanceof Array) {
      element.set(k, datum.map(it => fromData(model, it)));
      return;
    }

    if (datum) element.set(k, datum);
  });

  if (data.content) data.content.forEach(it => element._content.add(fromData(model, it)));

  return element;
}
