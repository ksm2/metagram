import { ModelElement } from './ModelElement';
import { Classifier } from './Classifier';
import { Class, Attribute } from '../decorators/index';

/**
 * A DirectedRelationship represents a relationship between a collection of source model Elements and a collection of target model Elements.
 */
@Class('http://www.omg.org/spec/UML/20131001:DirectedRelationship', ModelElement)
export class DirectedRelationship extends ModelElement {
  private _source: Classifier;
  private _target: Classifier;

  @Attribute({ type: Classifier })
  get source(): Classifier {
    return this._source;
  }

  set source(value: Classifier) {
    this._source = value;
  }

  @Attribute({ type: Classifier })
  get target(): Classifier {
    return this._target;
  }

  set target(value: Classifier) {
    this._target = value;
  }
}
