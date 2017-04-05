import * as Metagram from '../metamodel';
import { IDifference } from './IDifference';
import { IDocumentation } from './IDocumentation';
import { IExtension } from './IExtension';
import { IXMI } from './IXMI';

export class XMI extends Metagram.Element implements IXMI {
  private _documentations: Metagram.Attribute<IDocumentation>;
  private _differences: Metagram.Attribute<IDifference>;
  private _extensions: Metagram.Attribute<IExtension>;

  constructor() {
    super();

    this._documentations = new Metagram.Attribute<IDocumentation>('documentation', false, true, 0, 1);
    this._differences = new Metagram.Attribute<IDifference>('difference', false, true, 0, Infinity);
    this._extensions = new Metagram.Attribute<IExtension>('extension', false, true, 0, Infinity);
  }

  set documentation(value: IDocumentation | undefined) {
    this._documentations.set(value);
  }

  get documentation(): IDocumentation | undefined {
    return this._documentations.get();
  }

  getAllDocumentations(): Metagram.ArbitraryUniqueCollection<IDocumentation> {
    return this._documentations.asSet();
  }

  appendDocumentation(value: IDocumentation): boolean {
    return this._documentations.append(value);
  }

  removeDocumentation(value: IDocumentation): boolean {
    return this._documentations.remove(value);
  }

  hasDocumentation(): boolean {
    return this._documentations.isNotEmpty();
  }

  set difference(value: IDifference | undefined) {
    this._differences.set(value);
  }

  get difference(): IDifference | undefined {
    return this._differences.get();
  }

  getAllDifferences(): Metagram.ArbitraryUniqueCollection<IDifference> {
    return this._differences.asSet();
  }

  appendDifference(value: IDifference): boolean {
    return this._differences.append(value);
  }

  removeDifference(value: IDifference): boolean {
    return this._differences.remove(value);
  }

  hasDifference(): boolean {
    return this._differences.isNotEmpty();
  }

  set extension(value: IExtension | undefined) {
    this._extensions.set(value);
  }

  get extension(): IExtension | undefined {
    return this._extensions.get();
  }

  getAllExtensions(): Metagram.ArbitraryUniqueCollection<IExtension> {
    return this._extensions.asSet();
  }

  appendExtension(value: IExtension): boolean {
    return this._extensions.append(value);
  }

  removeExtension(value: IExtension): boolean {
    return this._extensions.remove(value);
  }

  hasExtension(): boolean {
    return this._extensions.isNotEmpty();
  }
}

Metagram.Metamodel.registerModel('http://www.omg.org/spec/XMI/20131001/XMI-model.xmi#_XMI-XMI', XMI);
