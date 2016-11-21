import { AbstractLoader, ModelElementObject } from './AbstractLoader';
import { Parser, Builder } from 'xml2js';
import { Model } from '../model/Model';

export class XMILoader extends AbstractLoader {
  private parser: Parser;
  private builder: Builder;

  constructor() {
    super();
    this.parser = new Parser();
    this.builder = new Builder();
  }

  async loadFromString(data: string): Promise<Model> {
    const object = await new Promise<ModelElementObject[]>((resolve, reject) => {
      this.parser.parseString(data, (err: string, result: Object) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(this.transformXMIToObject(result));
      });
    });

    return this.loadFromObject(object);
  }

  saveToString(model: Model): Promise<string> {
    return this.saveToObject(model).then(data => this.builder.buildObject(data));
  }

  private transformXMIToObject(xmlObject: { [key: string]: any }): ModelElementObject[] {
    for (let first in xmlObject) {
      const xmi = xmlObject[first];
      const namespaces = xmi['$'];

      const ns = new Map(Object.getOwnPropertyNames(namespaces).filter(key => key.startsWith('xmlns:')).map((key) => {
        const prefix: string = key.substr(6);
        const uri: string = namespaces[key];
        return [prefix, uri] as [string, string];
      }));

      const xmiNS = first.substr(0, first.indexOf(':'));

      const xmiURI = ns.get(xmiNS);
      if (!xmiURI) {
        throw 'URI of XMI not detected';
      }

      console.info(`Using XMI version ${xmiURI}`);

      return Object.getOwnPropertyNames(xmi).filter(key => key != '$').map((key) => {
        return this.transformXMIChildToObject(ns, xmi[key][0], xmiNS + ':', xmiURI);
      });
    }

    throw 'XML document is empty';
  }

  private transformXMIChildToObject(ns: Map<string, string>, content: any, xmiNS: string, parentURI: string): ModelElementObject {
    const $id = content.$[`${xmiNS}id`];
    let $type = content.$[`${xmiNS}type`];
    let $uri = parentURI;

    let i = $type.indexOf(':');
    if (i >= 0) {
      $uri = ns.get($type.substr(0, i)) || parentURI;
      $type = $type.substr(i + 1);
    }

    const attributes: { [key: string]: string } = {};
    Object.getOwnPropertyNames(content.$).filter(k => !k.startsWith(xmiNS)).forEach((key) => {
      attributes[key] = content.$[key];
    });

    const children: { [key: string]: ModelElementObject[] } = {};
    Object.getOwnPropertyNames(content).filter(k => k != '$').map((key) => {
      const childrenOfType: any[] = content[key];
      if (childrenOfType.length == 1 && typeof childrenOfType[0] == 'string') {
        attributes[key] = childrenOfType[0];
        return;
      }

      children[key] = childrenOfType.map(child => this.transformXMIChildToObject(ns, child, xmiNS, $uri));
    });
    // console.log(content.$);

    return Object.assign({ $uri, $id, $type }, attributes, children);
  }
}
