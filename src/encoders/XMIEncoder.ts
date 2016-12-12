import { AbstractEncoder } from './AbstractEncoder';
import { ModelElementObject, ModelDocumentObject } from './Encoder';
import { Parser, Builder } from 'xml2js';
import { Model } from '../model/Model';
import { FileService } from '../services/FileService';

export const XMI_VERSIONS: { [URI: string]: string } = {
  'http://www.omg.org/spec/XMI/20131001': '2.5.1',
  'http://www.omg.org/spec/XMI/20110701': '2.4.2',
  'http://www.omg.org/spec/XMI/20100901': '2.4.0',
  'http://www.omg.org/spec/XMI/20071001': '2.1.1',
};

export class XMIEncoder extends AbstractEncoder {
  private parser: Parser;
  private builder: Builder;

  constructor(fileService: FileService) {
    super(fileService);
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

  async saveToString(model: Model): Promise<string> {
    const modelObject = await this.saveToObject(model);
    const data = this.transformObjectToXMI(modelObject);
    return this.builder.buildObject(data);
  }

  private transformXMIToObject(xmlObject: { [key: string]: any }): ModelDocumentObject {
    for (let first in xmlObject) {
      const xmi = xmlObject[first];
      const namespaces = xmi['$'];

      // Find all namespaces
      const ns = new Map(Object.getOwnPropertyNames(namespaces).filter(key => key.startsWith('xmlns:')).map((key) => {
        const prefix: string = key.substr(6);
        const uri: string = namespaces[key];
        return [prefix, uri] as [string, string];
      }));

      // Find the XMI namespace
      const xmiNS = first.substr(0, first.indexOf(':'));

      // Find the XMI URI and version
      const xmiURI = ns.get(xmiNS);
      if (!xmiURI) throw 'URI of XMI not detected';
      if (!XMI_VERSIONS[xmiURI]) throw `Unsupported XMI URI: ${xmiURI}`;
      console.info(`Using XMI version ${XMI_VERSIONS[xmiURI]}`);

      // Remove the XMI namespace
      ns.delete(xmiNS);

      const content: ModelElementObject[] = [];
      Object.getOwnPropertyNames(xmi).filter(key => key != '$').forEach((key) => {
        const children: any[] = xmi[key];
        children.map(child => this.transformXMIChildToObject(child, xmiNS + ':', xmiNS)).forEach(object => content.push(object));
      });

      return {
        content,
        namespaces: Array.from(ns),
      };
    }

    throw 'XML document is empty';
  }

  private transformXMIChildToObject(content: any, xmiNS: string, parentNS: string): ModelElementObject {
    const id = content.$[`${xmiNS}id`];
    let type = content.$[`${xmiNS}type`];
    let ns = parentNS;
    let $content: { content: ModelElementObject[] } | undefined;

    if (!type) type = 'uml:Package'; // FIXME: Should be loaded from HREF

    let i = type.indexOf(':');
    if (i >= 0) {
      ns = type.substr(0, i);
      type = type.substr(i + 1);
    }

    const attributes: { [key: string]: string } = {};
    Object.getOwnPropertyNames(content.$).filter(k => !k.startsWith(xmiNS)).forEach((key) => {
      attributes[key] = content.$[key];
    });

    const children: { [key: string]: ModelElementObject[] } = {};
    Object.getOwnPropertyNames(content).filter(k => k != '$').forEach((key) => {
      const childrenOfType: any[] = content[key];
      if (key.includes(':')) {
        if (!$content) $content = { content: [] };
        childrenOfType.map(child => this.transformXMIChildToObject(child, xmiNS, ns)).forEach(x => $content!.content.push(x));
        return;
      }

      if (childrenOfType.length == 1 && typeof childrenOfType[0] == 'string') {
        attributes[key] = childrenOfType[0];
        return;
      }

      children[key] = childrenOfType.map(child => this.transformXMIChildToObject(child, xmiNS, ns));
    });

    return Object.assign({ ns, id, type, el: Object.assign(attributes, children) }, $content);
  }

  private transformObjectToXMI(modelObject: ModelDocumentObject): Object {
    const { namespaces, content } = modelObject;

    // Transform namespaces
    const xmlns: any = { 'xmlns:xmi': 'http://www.omg.org/spec/XMI/20131001' };
    for (let [ns, uri] of namespaces) {
      xmlns[`xmlns:${ns}`] = uri;
    }

    // Transform children
    const children = this.transformModelObjectContent(content);

    return {
      'xmi:XMI': Object.assign({ '$': xmlns }, children),
    };
  }

  private transformModelObjectContent(children: ModelElementObject[]): Object {
    const content: any = {};
    children.forEach((child) => {
      const tag = `${child.ns}:${child.type}`;
      if (!content[tag]) content[tag] = [];
      content[tag].push(this.transformObjectToXMIChild(child));
    });

    return content;
  }

  private transformObjectToXMIChild(c: ModelElementObject): Object {
    // Transform XMI attributes
    const xmiAttr: any = {
      'xmi:type': `${c.ns}:${c.type}`,
    };
    if (c.id) xmiAttr['xmi:id'] = c.id;

    // Transform children
    const children = c.content ? this.transformModelObjectContent(c.content) : {};

    // Transform attributes
    const simpleAttr: any = {};
    const complexAttr: any = {};
    Object.getOwnPropertyNames(c.el).forEach((key) => {
      const value = c.el[key];
      if (value instanceof Array) {
        if (!complexAttr[key]) complexAttr[key] = [];
        value.map(child => this.transformObjectToXMIChild(child)).forEach(it => complexAttr[key].push(it));
        return;
      }

      if (!simpleAttr[key]) simpleAttr[key] = [];
      simpleAttr[key].push(value);
    });

    return Object.assign({ '$': Object.assign(xmiAttr, simpleAttr) }, children, complexAttr);
  }
}
