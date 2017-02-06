import { Package } from '../models/uml/Package';
import { Shape } from './Shape';
import { Class, Attribute } from '../decorators';

@Class('Diagram', Shape)
export class Diagram extends Shape<Package> {
  private _name: string;
  private _documentation: string;
  private _resolution: number = 300;

  @Attribute({ type: String })
  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  @Attribute({ type: String })
  get documentation(): string {
    return this._documentation;
  }

  set documentation(value: string) {
    this._documentation = value;
  }

  @Attribute({ type: Number })
  get resolution(): number {
    return this._resolution;
  }

  set resolution(value: number) {
    this._resolution = value;
  }
}
