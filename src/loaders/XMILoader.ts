import { AbstractLoader, ModelElementObject, ModelObject } from './AbstractLoader';
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
    const xmiObject = await new Promise<Object>((resolve, reject) => {
      this.parser.parseString(data, (err: string, result: Object) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(result);
      });
    });

    const modelObject = this.transformXMIToObject(xmiObject);

    return this.loadFromObject(modelObject);
  }

  saveToString(model: Model): Promise<string> {
    return this.saveToObject(model).then(data => this.builder.buildObject(data));
  }

  private transformXMIToObject(xmlObject: { [key: string]: any }): ModelObject {
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

      return {
        namespaces: Array.from(ns),
        content: Object.getOwnPropertyNames(xmi).filter(key => key != '$').map((key) => {
          return this.transformXMIChildToObject(xmi[key][0], xmiNS + ':', xmiNS);
        }),
      };
    }

    throw 'XML document is empty';
  }

  private transformXMIChildToObject(content: any, xmiNS: string, parentNS: string): ModelElementObject {
    const $id = content.$[`${xmiNS}id`];
    let $type = content.$[`${xmiNS}type`];
    let $ns = parentNS;

    let i = $type.indexOf(':');
    if (i >= 0) {
      $ns = $type.substr(0, i);
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

      children[key] = childrenOfType.map(child => this.transformXMIChildToObject(child, xmiNS, $ns));
    });

    return Object.assign({ $ns, $id, $type }, attributes, children);
  }
}
