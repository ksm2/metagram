import { TypedElement } from './TypedElement';
import { Parameter } from './Parameter';
import { Class, Attribute } from '../decorators';
import { Type } from './Type';
import { ParameterDirectionKind } from './ParameterDirectionKind';

@Class('Operation', TypedElement)
export class Operation extends TypedElement {
  private _ownedParameters: Set<Parameter> = new Set();

  @Attribute({ type: Parameter, lower: 0, upper: Infinity })
  get ownedParameters(): Set<Parameter> {
    return this._ownedParameters;
  }

  set ownedParameters(value: Set<Parameter>) {
    this._ownedParameters = value;
  }

  get type(): Type {
    const returnParam = [...this.ownedParameters].find(p => p.direction === ParameterDirectionKind.return)!;
    return returnParam.type;
  }
}
