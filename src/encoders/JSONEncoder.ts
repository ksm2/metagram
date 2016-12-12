import { AbstractEncoder } from './AbstractEncoder';
import { ModelDocumentObject } from './Encoder';
import { Model } from '../model/Model';

export class JSONEncoder extends AbstractEncoder {
  loadFromString(data: string): Promise<Model> {
    return new Promise<ModelDocumentObject>((reject, resolve) => {
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
