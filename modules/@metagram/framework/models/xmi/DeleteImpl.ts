import { ArbitraryUniqueCollection, ArbitraryAmbiguousCollection, OrderedUniqueCollection, OrderedAmbiguousCollection } from '../Collections';
import { Element as $Elm } from '../Element';
import { Attribute as $Attr } from '../Attribute';
import { Metamodel as $MM } from '../Metamodel';
import { Difference } from './Difference';
import { Element } from '../Element';
import { Delete } from './Delete';

/**

 */
export class DeleteImpl extends $Elm implements Delete {

  private _containers: $Attr<Difference> = new $Attr<Difference>('container', false, true, 0, 1);
  private _differences: $Attr<Difference> = new $Attr<Difference>('difference', false, true, 0, Infinity);
  private _targets: $Attr<Element> = new $Attr<Element>('target', false, true, 0, Infinity);
  

  set container(value: Difference | undefined) { 
    this._containers.set(value); 
  }
  
  get container(): Difference | undefined {
    return this._containers.get(); 
  }

  getAllContainers(): ArbitraryUniqueCollection<Difference> { 
    return this._containers.asSet(); 
  }

  appendContainer(value: Difference): boolean { 
    return this._containers.append(value); 
  }
  
  removeContainer(value: Difference): boolean {
    return this._containers.remove(value); 
  }

  hasContainer(): boolean {
    return this._containers.isNotEmpty(); 
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


  set target(value: Element | undefined) { 
    this._targets.set(value); 
  }
  
  get target(): Element | undefined {
    return this._targets.get(); 
  }

  getAllTargets(): ArbitraryUniqueCollection<Element> { 
    return this._targets.asSet(); 
  }

  appendTarget(value: Element): boolean { 
    return this._targets.append(value); 
  }
  
  removeTarget(value: Element): boolean {
    return this._targets.remove(value); 
  }

  hasTarget(): boolean {
    return this._targets.isNotEmpty(); 
  }


}

$MM.registerModel('http://www.omg.org/spec/XMI/20131001/XMI-model.xmi#_XMI-Delete', DeleteImpl);
