import { AbstractLoader, ModelObject } from './AbstractLoader';
import { Model } from '../model/Model';

export class JSONLoader extends AbstractLoader {
  loadFromString(data: string): Promise<Model> {
    return new Promise<ModelObject>((reject, resolve) => {
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    }).then(object => this.loadFromObject(object));
  }

  saveToString(model: Model): Promise<string> {
    return this.saveToObject(model).then(object => JSON.stringify(object));
  }
}
