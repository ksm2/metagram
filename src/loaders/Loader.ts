import { XMILoader } from './XMILoader';
import { JSONLoader } from './JSONLoader';
import { AbstractLoader } from './AbstractLoader';
import { Model } from '../model/Model';

export class Loader {
  private loaders: { [key: string]: AbstractLoader };

  constructor() {
    this.loaders = {
      xmi: new XMILoader(),
      json: new JSONLoader(),
    };
  }

  loadFromXMI(filename: string, encoding: string = 'utf8'): Promise<Model> {
    return this.loaders['xmi'].loadFromFile(filename, encoding);
  }

  saveToXMI(model: Model, filename: string, encoding: string = 'utf8'): Promise<void> {
    return this.loaders['xmi'].saveToFile(model, filename, encoding);
  }

  loadFromJSON(filename: string, encoding: string = 'utf8'): Promise<Model> {
    return this.loaders['json'].loadFromFile(filename, encoding);
  }

  saveToJSON(model: Model, filename: string, encoding: string = 'utf8'): Promise<void> {
    return this.loaders['json'].saveToFile(model, filename, encoding);
  }
}
