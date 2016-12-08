import { Model } from './Model';
import { ModelElementObject, ModelObjectElements } from '../loaders/AbstractLoader';
import { ModelNamespace } from './ModelNamespace';

export class ModelElement {
  protected model: Model;
  private id: string;
  private ns: string;
  private type: string;
  private elements: Map<string, string | ModelElement[]>;
  private content: Set<ModelElement>;

  constructor(model: Model, id: string, uri: string, type: string) {
    this.model = model;
    this.id = id;
    this.ns = uri;
    this.type = type;
    this.elements = new Map();
    this.content = new Set();

    model.setElementById(id, this);
  }

  static fromData(model: Model, data: ModelElementObject): ModelElement {
    const element = new ModelElement(model, data.id || '', data.ns, data.type);

    Object.getOwnPropertyNames(data.el).forEach((k) => {
      let datum: string | ModelElementObject[] = data.el[k];
      if (datum instanceof Array) {
        element.set(k, datum.map(it => ModelElement.fromData(model, it)));
        return;
      }

      if (datum) element.set(k, datum);
    });

    if (data.content) data.content.forEach(it => element.content.add(ModelElement.fromData(model, it)));

    return element;
  }

  getData(): ModelElementObject {
    const { id, type, ns } = this;
    const object: ModelElementObject = { id, type, ns, el: {} };
    this.elements.forEach((value, key) => {
      let datum: any = value;
      if (datum instanceof Array) {
        datum = datum.map(it => it.getData());
      }
      object.el[key] = datum;
    });

    if (this.content.size) {
      object.content = Array.from(this.content).map(it => it.getData());
    }

    return object;
  }

  getID(): string {
    return this.id;
  }

  getNamespace(): ModelNamespace {
    return this.model.getNamespace(this.ns);
  }

  getType(): string {
    return this.type;
  }

  has(key: string): boolean {
    return this.elements.has(key);
  }

  set(key: string, value: string | ModelElement[]): void {
    this.elements.set(key, value);
  }

  getString(key: string, defaultValue?: string): string | undefined {
    if (!this.has(key)) return defaultValue;

    const value = this.elements.get(key);
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

  getElement(key: string, defaultValue?: ModelElement): ModelElement | undefined {
    const values = this.getElements(key);
    return values.length >= 1 ? values[0] : defaultValue;
  }

  getElements(key: string, defaultValue: ModelElement[] = []): ModelElement[] {
    if (!this.has(key)) return defaultValue;
    const value = this.elements.get(key);

    return value instanceof Array ? value : defaultValue;
  }
}
