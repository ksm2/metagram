import { Encoder, ModelDocumentObject } from './Encoder';
import { Model } from '../model/Model';

export class JSONEncoder extends Encoder {
  async decodeString(data: string): Promise<ModelDocumentObject> {
    return new Promise<ModelDocumentObject>((reject, resolve) => {
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
  }

  async encodeString(model: ModelDocumentObject): Promise<string> {
    return JSON.stringify(model);
  }
}
