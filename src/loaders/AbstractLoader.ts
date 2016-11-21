import { Model } from '../model/Model';
import fs = require('fs');

export type NamespaceObject = [string, string][];

export interface ModelObject {
  namespaces: NamespaceObject;
  content: ModelElementObject[];
}

export interface ModelElementObject {
  $ns: string;
  $type: string;
  $id: string;
  [children: string]: ModelElementObject[] | string;
}

export abstract class AbstractLoader {

  /**
   * Loads a model from file
   *
   * @param filename Name of the file to load
   * @param [encoding] Encoding of that file
   * @returns Promise for a model element
   */
  loadFromFile(filename: string, encoding: string = 'utf8'): Promise<Model> {
    return new Promise((resolve, reject) => {
      fs.readFile(filename, encoding, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(this.loadFromString(data));
      });
    });
  }

  /**
   * Loads a model from object
   *
   * @param data An object to load the model element from
   * @returns Promise for a model element
   */
  async loadFromObject(data: ModelObject): Promise<Model> {
    return new Model(data);
  }

  /**
   * Loads a model from string
   *
   * @param data A string containing data parsable by this loader
   */
  abstract loadFromString(data: string): Promise<Model>;

  /**
   * Loads a model from file
   *
   * @param model Model which should be saved
   * @param filename Name of the file to save
   * @param [encoding] Encoding of that file
   * @returns Promise to successful writing
   */
  async saveToFile(model: Model, filename: string, encoding: string = 'utf8'): Promise<void> {
    const data = await this.saveToString(model);
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(filename, data, { encoding }, (err) => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }

  /**
   * Saves a model to object
   *
   * @param model Model which should be saved
   * @returns Promise for an object
   */
  async saveToObject(model: Model): Promise<ModelObject> {
    return {
      namespaces: model.getNamespaces(),
      content: Array.from(model.getElements()).map(it => it.getData()),
    };
  }

  /**
   * Saves a model to string
   *
   * @param model Model which should be saved
   */
  abstract saveToString(model: Model): Promise<string>;
}
