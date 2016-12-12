import { Encoder } from '../encoders/Encoder';
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

  deserialize(format: string, filename: string, encoding: string = 'utf8'): Promise<Model> {
    return this.encoders[format].loadFromURL(filename, encoding);
  }

  serialize(model: Model, format: string, filename: string, encoding: string = 'utf8'): Promise<void> {
    return this.encoders[format].saveToFile(model, filename, encoding);
  }
}
