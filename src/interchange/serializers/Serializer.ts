import { Entity, Model, ModelDocumentObject, ModelElementObject } from '@metagram/model';
import * as UML from '@metagram/uml250';
import { Encoder } from '../encoders/Encoder';

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
    const m = new Model();
    m.setNamespaces(object.namespaces);

    for (let elementObj of object.content) {
      const e = this.denormalizeElementObject(m, elementObj);
      m.addElement(e);
    }

    return m;
  }

  denormalizeElementObject(model: Model, data: ModelElementObject): Entity {
    let type: any = Entity;
    if (data.ns == 'uml') {
      const uml: { [type: string]: Function } = UML as any;
      type = uml[data.type];
    }

    const element = new type(model);
    if (data.id) {
      element.setID(data.id);
    }
    element.setNamespace(data.ns);
    element.setType(data.type);

    Object.getOwnPropertyNames(data.el).forEach((k) => {
      let datum: string | ModelElementObject[] = data.el[k];
      if (datum instanceof Array) {
        element.set(k, datum.map(it => this.denormalizeElementObject(model, it)));
        return;
      }

      if (datum) element.set(k, datum);
    });

    if (data.content) data.content.forEach(it => element._content.add(this.denormalizeElementObject(model, it)));

    return element;
  }

}
