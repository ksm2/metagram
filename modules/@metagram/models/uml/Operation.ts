import { TypedElement } from './TypedElement';
import { Parameter } from './Parameter';
import { Class, Attribute } from '../decorators';
import { Type } from './Type';
import { ParameterDirectionKind } from './ParameterDirectionKind';

@Class('http://www.omg.org/spec/UML/20131001:Operation', TypedElement)
export class Operation extends TypedElement {
  private _ownedParameters: Set<Parameter> = new Set();

  @Attribute({ type: Parameter, lower: 0, upper: Infinity })
  get ownedParameters(): Set<Parameter> {
    return this._ownedParameters;
  }

  set ownedParameters(value: Set<Parameter>) {
    this._ownedParameters = value;
  }

  get type(): Type | null {
    const returnParam = [...this.ownedParameters].find(p => p.direction === ParameterDirectionKind.RETURN);
    return returnParam && returnParam.type || null;
  }
}
