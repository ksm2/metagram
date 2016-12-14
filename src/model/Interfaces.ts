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
