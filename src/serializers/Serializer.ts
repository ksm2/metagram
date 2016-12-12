import { Encoder, ModelDocumentObject } from '../encoders/Encoder';
import { Model } from '../model/Model';

export interface SerializerOptions {
  encoders?: SerializerEncoders;
}

export interface SerializerEncoders {
  [key: string]: Encoder;
}

export class Serializer {
  private encoders: SerializerEncoders;

  constructor(options: SerializerOptions) {
    this.encoders = options.encoders || {};
  }

  /**
   * Serializes a model and saves it to a given filename
   */
  async serialize(model: Model, format: string, filename: string, encoding: string = 'utf8'): Promise<void> {
    const obj = await this.normalize(model);
    return this.encoders[format].encodeFile(obj, filename, encoding);
  }

  /**
   * Deserializes a model given from data stored at a filename
   */
  async deserialize(format: string, filename: string, encoding: string = 'utf8'): Promise<Model> {
    const obj = await this.encoders[format].decodeURL(filename, encoding);
    return this.denormalize(obj);
  }

  /**
   * Normalizes a model to an object.
   */
  async normalize(model: Model): Promise<ModelDocumentObject> {
    return {
      namespaces: model.getNamespaces(),
      content: Array.from(model.getElements()).map(it => it.getData()),
    };
  }

  /**
   * Denormalizes an object to a model.
   */
  async denormalize(object: ModelDocumentObject): Promise<Model> {
    return new Model(object);
  }
}
