import { Model } from '../model/Model';

export type NamespaceObject = [string, string][];

export interface ModelObject {
  content?: ModelElementObject[];
}

export interface ModelDocumentObject extends ModelObject {
  namespaces: NamespaceObject;
  content: ModelElementObject[];
}

export interface ModelObjectElements {
  [child: string]: ModelElementObject[] | string;
}

export interface ModelElementObject extends ModelObject {
  ns: string;
  type: string;
  id?: string;
  el: ModelObjectElements;
}

export interface Encoder {
  /**
   * Loads a model from an URL
   *
   * @param url URL where the file can be found
   * @param [encoding] Encoding of that file
   * @returns Promise for a model element
   */
  loadFromURL(url: string, encoding?: string): Promise<Model>;

  /**
   * Loads a model from file
   *
   * @param filename Name of the file to load
   * @param [encoding] Encoding of that file
   * @returns Promise for a model element
   */
  loadFromFile(filename: string, encoding?: string): Promise<Model>;

  /**
   * Loads a model from object
   *
   * @param data An object to load the model element from
   * @returns Promise for a model element
   */
  loadFromObject(data: ModelDocumentObject): Promise<Model>;

  /**
   * Loads a model from string
   *
   * @param data A string containing data parsable by this loader
   */
  loadFromString(data: string): Promise<Model>;

  /**
   * Loads a model from file
   *
   * @param model Model which should be saved
   * @param filename Name of the file to save
   * @param [encoding] Encoding of that file
   * @returns Promise to successful writing
   */
  saveToFile(model: Model, filename: string, encoding?: string): Promise<void>;

  /**
   * Saves a model to object
   *
   * @param model Model which should be saved
   * @returns Promise for an object
   */
  saveToObject(model: Model): Promise<ModelDocumentObject>;

  /**
   * Saves a model to string
   *
   * @param model Model which should be saved
   */
  saveToString(model: Model): Promise<string>;
}
