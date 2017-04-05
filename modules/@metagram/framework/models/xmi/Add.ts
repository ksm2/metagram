import * as Metagram from '../metamodel';
import { IAdd } from './IAdd';
import { IDifference } from './IDifference';

export class Add extends Metagram.Element implements IAdd {
  private _containers: Metagram.Attribute<IDifference>;
  private _differences: Metagram.Attribute<IDifference>;
  private _targets: Metagram.Attribute<Metagram.Element>;
  private _positions: Metagram.Attribute<number>;
  private _additions: Metagram.Attribute<Metagram.Element>;

  constructor() {
    super();

    this._containers = new Metagram.Attribute<IDifference>('container', false, true, 0, 1);
    this._differences = new Metagram.Attribute<IDifference>('difference', false, true, 0, Infinity);
    this._targets = new Metagram.Attribute<Metagram.Element>('target', false, true, 0, Infinity);
    this._positions = new Metagram.Attribute<number>('position', false, true, 0, 1);
    this._additions = new Metagram.Attribute<Metagram.Element>('addition', false, true, 0, Infinity);
  }

  set container(value: IDifference | undefined) {
    this._containers.set(value);
  }

  get container(): IDifference | undefined {
    return this._containers.get();
  }

  getAllContainers(): Metagram.ArbitraryUniqueCollection<IDifference> {
    return this._containers.asSet();
  }

  appendContainer(value: IDifference): boolean {
    return this._containers.append(value);
  }

  removeContainer(value: IDifference): boolean {
    return this._containers.remove(value);
  }

  hasContainer(): boolean {
    return this._containers.isNotEmpty();
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

  set target(value: Metagram.Element | undefined) {
    this._targets.set(value);
  }

  get target(): Metagram.Element | undefined {
    return this._targets.get();
  }

  getAllTargets(): Metagram.ArbitraryUniqueCollection<Metagram.Element> {
    return this._targets.asSet();
  }

  appendTarget(value: Metagram.Element): boolean {
    return this._targets.append(value);
  }

  removeTarget(value: Metagram.Element): boolean {
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

  getAllPositions(): Metagram.ArbitraryUniqueCollection<number> {
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

  set addition(value: Metagram.Element | undefined) {
    this._additions.set(value);
  }

  get addition(): Metagram.Element | undefined {
    return this._additions.get();
  }

  getAllAdditions(): Metagram.ArbitraryUniqueCollection<Metagram.Element> {
    return this._additions.asSet();
  }

  appendAddition(value: Metagram.Element): boolean {
    return this._additions.append(value);
  }

  removeAddition(value: Metagram.Element): boolean {
    return this._additions.remove(value);
  }

  hasAddition(): boolean {
    return this._additions.isNotEmpty();
  }
}

Metagram.Metamodel.registerModel('http://www.omg.org/spec/XMI/20131001/XMI-model.xmi#_XMI-Add', Add);
