import { Model } from './Model';
import { ModelElementObject } from '../loaders/AbstractLoader';

export class ModelElement {
  private $id: string;
  private $uri: string;
  private $type: string;
  private elements: Map<string, string | ModelElement[]>;

  constructor(protected model: Model, data: ModelElementObject) {
    model.setElementById(data.$id, this);
    this.$id = data.$id;
    this.$uri = data.$uri;
    this.$type = data.$type;
    this.elements = new Map(Object.getOwnPropertyNames(data).filter(k => !k.startsWith('$')).map((k) => {
      let datum: string | any[] = data[k];
      if (datum instanceof Array) {
        datum = datum.map(it => new ModelElement(model, it));
      }

      return [k, datum] as [string, string | ModelElement[]];
    }));
  }

  getData(): ModelElementObject {
    const { $id, $uri, $type } = this;
    const children: { [key: string]: string | ModelElementObject[] } = {};
    this.elements.forEach((value, key) => {
      let datum: any = value;
      if (datum instanceof Array) {
        datum = datum.map(it => it.getData());
      }
      children[key] = datum;
    });
    return Object.assign({ $type, $id, $uri }, children);
  }

  getID(): string {
    return this.$id;
  }

  getURI(): string {
    return this.$uri;
  }

  getType(): string {
    return this.$type;
  }

  has(key: string): boolean {
    return this.elements.has(key);
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
