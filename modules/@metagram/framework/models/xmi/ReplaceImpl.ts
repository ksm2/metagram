import { ArbitraryUniqueCollection, ArbitraryAmbiguousCollection, OrderedUniqueCollection, OrderedAmbiguousCollection } from '../Collections';
import { Element } from '../Element';
import { Attribute as $Attr } from '../Attribute';
import { Metamodel as $MM } from '../Metamodel';
import { Difference } from './Difference';
import { Replace } from './Replace';

/**

 */
export class ReplaceImpl extends Element implements Replace {

  private _containers: $Attr<Difference> = new $Attr<Difference>('container', false, true, 0, 1);
  private _differences: $Attr<Difference> = new $Attr<Difference>('difference', false, true, 0, Infinity);
  private _targets: $Attr<Element> = new $Attr<Element>('target', false, true, 0, Infinity);
  private _positions: $Attr<number> = new $Attr<number>('position', false, true, 0, 1);
  private _replacements: $Attr<Element> = new $Attr<Element>('replacement', false, true, 0, Infinity);
  

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


  set replacement(value: Element | undefined) { 
    this._replacements.set(value); 
  }
  
  get replacement(): Element | undefined {
    return this._replacements.get(); 
  }

  getAllReplacements(): ArbitraryUniqueCollection<Element> { 
    return this._replacements.asSet(); 
  }

  appendReplacement(value: Element): boolean { 
    return this._replacements.append(value); 
  }
  
  removeReplacement(value: Element): boolean {
    return this._replacements.remove(value); 
  }

  hasReplacement(): boolean {
    return this._replacements.isNotEmpty(); 
  }


}

$MM.registerModel('http://www.omg.org/spec/XMI/20131001/XMI-model.xmi#_XMI-Replace', ReplaceImpl);
