import { ArbitraryUniqueCollection, ArbitraryAmbiguousCollection, OrderedUniqueCollection, OrderedAmbiguousCollection } from '../Collections';
import { Element as $Elm } from '../Element';
import { Attribute as $Attr } from '../Attribute';
import { Metamodel as $MM } from '../Metamodel';
import { Difference } from './Difference';
import { Element } from '../Element';
import { Add } from './Add';

/**

 */
export class AddImpl extends $Elm implements Add {

  private _containers: $Attr<Difference> = new $Attr<Difference>('container', false, true, 0, 1);
  private _differences: $Attr<Difference> = new $Attr<Difference>('difference', false, true, 0, Infinity);
  private _targets: $Attr<Element> = new $Attr<Element>('target', false, true, 0, Infinity);
  private _positions: $Attr<number> = new $Attr<number>('position', false, true, 0, 1);
  private _additions: $Attr<Element> = new $Attr<Element>('addition', false, true, 0, Infinity);
  

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


  set position(value: number | undefined) { 
    this._positions.set(value); 
  }
  
  get position(): number | undefined {
    return this._positions.get(); 
  }

  getAllPositions(): ArbitraryUniqueCollection<number> { 
    return this._positions.asSet(); 
  }

  appendPosition(value: number): boolean { 
    return this._positions.append(value); 
  }
  
  removePosition(value: number): boolean {
    return this._positions.remove(value); 
  }

  hasPosition(): boolean {
    return this._positions.isNotEmpty(); 
  }


  set addition(value: Element | undefined) { 
    this._additions.set(value); 
  }
  
  get addition(): Element | undefined {
    return this._additions.get(); 
  }

  getAllAdditions(): ArbitraryUniqueCollection<Element> { 
    return this._additions.asSet(); 
  }

  appendAddition(value: Element): boolean { 
    return this._additions.append(value); 
  }
  
  removeAddition(value: Element): boolean {
    return this._additions.remove(value); 
  }

  hasAddition(): boolean {
    return this._additions.isNotEmpty(); 
  }


}

$MM.registerModel('http://www.omg.org/spec/XMI/20131001/XMI-model.xmi#_XMI-Add', AddImpl);
