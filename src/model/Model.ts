import { ModelElement } from './ModelElement';
import { ModelElementObject } from '../loaders/AbstractLoader';

export class Model {
  private idMap: Map<string, ModelElement>;
  private elements: Set<ModelElement>;

  constructor(data: ModelElementObject[]) {
    this.idMap = new Map();
    this.elements = new Set(data.map(datum => new ModelElement(this, datum)));
  }

  getElementById(id: string): ModelElement | undefined {
    return this.idMap.get(id);
  }

  setElementById(id: string, element: ModelElement) {
    this.idMap.set(id, element);
  }

  getElements(): Set<ModelElement> {
    return this.elements;
  }
}
