import { ArbitraryUniqueCollection, ArbitraryAmbiguousCollection, OrderedUniqueCollection, OrderedAmbiguousCollection } from '../Collections';
import { Element as $Elm } from '../Element';
import { Attribute as $Attr } from '../Attribute';
import { Metamodel as $MM } from '../Metamodel';

import { Extension } from './Extension';

/**

 */
export class ExtensionImpl extends $Elm implements Extension {

  private _extenders: $Attr<string> = new $Attr<string>('extender', false, true, 1, 1);
  private _extenderIDs: $Attr<string> = new $Attr<string>('extenderID', false, true, 0, 1);
  

  set extender(value: string | undefined) { 
    this._extenders.set(value); 
  }
  
  get extender(): string | undefined {
    return this._extenders.get()!; 
  }

  getAllExtenders(): ArbitraryUniqueCollection<string> { 
    return this._extenders.asSet(); 
  }


  set extenderID(value: string | undefined) { 
    this._extenderIDs.set(value); 
  }
  
  get extenderID(): string | undefined {
    return this._extenderIDs.get(); 
  }

  getAllExtenderIDs(): ArbitraryUniqueCollection<string> { 
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

$MM.registerModel('http://www.omg.org/spec/XMI/20131001/XMI-model.xmi#_XMI-Extension', ExtensionImpl);
