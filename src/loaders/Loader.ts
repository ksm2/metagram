import { XMILoader } from './XMILoader';
import { JSONLoader } from './JSONLoader';
import { AbstractLoader } from './AbstractLoader';
import { Model } from '../model/Model';
import { FileService } from '../services/FileService';

export class Loader {
  private loaders: { [key: string]: AbstractLoader };

  constructor() {
    const fileService = new FileService();
    this.loaders = {
      xmi: new XMILoader(fileService),
      json: new JSONLoader(fileService),
    };
  }

  loadFromXMI(filename: string, encoding: string = 'utf8'): Promise<Model> {
    return this.loaders['xmi'].loadFromURL(filename, encoding);
  }

  saveToXMI(model: Model, filename: string, encoding: string = 'utf8'): Promise<void> {
    return this.loaders['xmi'].saveToFile(model, filename, encoding);
  }

  loadFromJSON(filename: string, encoding: string = 'utf8'): Promise<Model> {
    return this.loaders['json'].loadFromURL(filename, encoding);
  }

  saveToJSON(model: Model, filename: string, encoding: string = 'utf8'): Promise<void> {
    return this.loaders['json'].saveToFile(model, filename, encoding);
  }
}
