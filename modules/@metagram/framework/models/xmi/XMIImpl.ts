import { ArbitraryUniqueCollection, ArbitraryAmbiguousCollection, OrderedUniqueCollection, OrderedAmbiguousCollection } from '../Collections';
import { Element as $Elm } from '../Element';
import { Attribute as $Attr } from '../Attribute';
import { Metamodel as $MM } from '../Metamodel';
import { Documentation } from './Documentation';
import { Difference } from './Difference';
import { Extension } from './Extension';
import { XMI } from './XMI';

/**

 */
export class XMIImpl extends $Elm implements XMI {

  private _documentations: $Attr<Documentation> = new $Attr<Documentation>('documentation', false, true, 0, 1);
  private _differences: $Attr<Difference> = new $Attr<Difference>('difference', false, true, 0, Infinity);
  private _extensions: $Attr<Extension> = new $Attr<Extension>('extension', false, true, 0, Infinity);
  

  set documentation(value: Documentation | undefined) { 
    this._documentations.set(value); 
  }
  
  get documentation(): Documentation | undefined {
    return this._documentations.get(); 
  }

  getAllDocumentations(): ArbitraryUniqueCollection<Documentation> { 
    return this._documentations.asSet(); 
  }

  appendDocumentation(value: Documentation): boolean { 
    return this._documentations.append(value); 
  }
  
  removeDocumentation(value: Documentation): boolean {
    return this._documentations.remove(value); 
  }

  hasDocumentation(): boolean {
    return this._documentations.isNotEmpty(); 
  }


  set difference(value: Difference | undefined) { 
    this._differences.set(value); 
  }
  
  get difference(): Difference | undefined {
    return this._differences.get(); 
  }

  getAllDifferences(): ArbitraryUniqueCollection<Difference> { 
    return this._differences.asSet(); 
  }

  appendDifference(value: Difference): boolean { 
    return this._differences.append(value); 
  }
  
  removeDifference(value: Difference): boolean {
    return this._differences.remove(value); 
  }

  hasDifference(): boolean {
    return this._differences.isNotEmpty(); 
  }


  set extension(value: Extension | undefined) { 
    this._extensions.set(value); 
  }
  
  get extension(): Extension | undefined {
    return this._extensions.get(); 
  }

  getAllExtensions(): ArbitraryUniqueCollection<Extension> { 
    return this._extensions.asSet(); 
  }

  appendExtension(value: Extension): boolean { 
    return this._extensions.append(value); 
  }
  
  removeExtension(value: Extension): boolean {
    return this._extensions.remove(value); 
  }

  hasExtension(): boolean {
    return this._extensions.isNotEmpty(); 
  }
}

$MM.registerModel('http://www.omg.org/spec/XMI/20131001/XMI-model.xmi#_XMI-XMI', XMIImpl);
