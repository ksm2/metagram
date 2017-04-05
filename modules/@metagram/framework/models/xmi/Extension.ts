import * as Metagram from '../metamodel';
import { IExtension } from './IExtension';

export class Extension extends Metagram.Element implements IExtension {
  private _extenders: Metagram.Attribute<string>;
  private _extenderIDs: Metagram.Attribute<string>;

  constructor() {
    super();

    this._extenders = new Metagram.Attribute<string>('extender', false, true, 1, 1);
    this._extenderIDs = new Metagram.Attribute<string>('extenderID', false, true, 0, 1);
  }

  set extender(value: string | undefined) {
    this._extenders.set(value);
  }

  get extender(): string | undefined {
    return this._extenders.get()!;
  }

  getAllExtenders(): Metagram.ArbitraryUniqueCollection<string> {
    return this._extenders.asSet();
  }

  set extenderID(value: string | undefined) {
    this._extenderIDs.set(value);
  }

  get extenderID(): string | undefined {
    return this._extenderIDs.get();
  }

  getAllExtenderIDs(): Metagram.ArbitraryUniqueCollection<string> {
    return this._extenderIDs.asSet();
  }

  appendExtenderID(value: string): boolean {
    return this._extenderIDs.append(value);
  }

  removeExtenderID(value: string): boolean {
    return this._extenderIDs.remove(value);
  }

  hasExtenderID(): boolean {
    return this._extenderIDs.isNotEmpty();
  }
}

Metagram.Metamodel.registerModel('http://www.omg.org/spec/XMI/20131001/XMI-model.xmi#_XMI-Extension', Extension);
