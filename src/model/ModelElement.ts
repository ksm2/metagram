import { Model } from './Model';
import { ModelElementObject } from '../loaders/AbstractLoader';
import { ModelNamespace } from './ModelNamespace';

export class ModelElement {
  protected model: Model;
  private $id: string;
  private $ns: string;
  private $type: string;
  private elements: Map<string, string | ModelElement[]>;

  constructor(model: Model, id: string, uri: string, type: string) {
    this.model = model;
    this.$id = id;
    this.$ns = uri;
    this.$type = type;
    this.elements = new Map();

    model.setElementById(id, this);
  }

  static fromData(model: Model, data: ModelElementObject): ModelElement {
    const element = new ModelElement(model, data.$id, data.$ns, data.$type);

    Object.getOwnPropertyNames(data).filter(k => !k.startsWith('$')).forEach((k) => {
      let datum: string | any[] = data[k];
      if (datum instanceof Array) {
        element.set(k, datum.map(it => ModelElement.fromData(model, it)));
        return;
      }

      element.set(k, datum);
    });

    return element;
  }

  getData(): ModelElementObject {
    const { $id, $type, $ns } = this;
    const children: { [key: string]: string | ModelElementObject[] } = {};
    this.elements.forEach((value, key) => {
      let datum: any = value;
      if (datum instanceof Array) {
        datum = datum.map(it => it.getData());
      }
      children[key] = datum;
    });
    return Object.assign({ $type, $id, $ns }, children);
  }

  getID(): string {
    return this.$id;
  }

  getNamespace(): ModelNamespace {
    return this.model.getNamespace(this.$ns);
  }

  getType(): string {
    return this.$type;
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
