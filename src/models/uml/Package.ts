import { ModelElement } from './ModelElement';
import { Class, Attribute } from '../../decorators';
import { Diagram } from '../../diagram/Diagram';

@Class('http://www.omg.org/spec/UML/20131001:Package', ModelElement)
export class Package extends ModelElement {
  private _URI: string | null = null;
  private _stereotype: string | null = null;
  private _packagedElement: Set<ModelElement> = new Set();

  @Attribute(String, 0, 1)
  get URI(): string | null {
    return this._URI;
  }

  set URI(value: string | null) {
    this._URI = value;
  }

  @Attribute(ModelElement, 0, Infinity)
  get packagedElement(): Set<ModelElement> {
    return this._packagedElement;
  }

  set packagedElement(value: Set<ModelElement>) {
    this._packagedElement = value;
  }

  @Attribute({ type: 'http://www.omg.org/spec/UML/20131001:String', lower: 0 })
  get stereotype(): string | null {
    return this._stereotype;
  }

  set stereotype(value: string | null) {
    this._stereotype = value;
  }

  getDiagrams(): Set<Diagram> {
    return new Set([...this.contents].filter(element => element instanceof Diagram) as Diagram[]);
  }
}
