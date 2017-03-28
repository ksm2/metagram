import { Enumeration } from '../../decorators';

/**
 * AggregationKind is an Enumeration for specifying the kind of aggregation of a Property.
 */
@Enumeration('http://www.omg.org/spec/UML/20131001:AggregationKind')
export class AggregationKind {
  // Indicates that the Property has no aggregation.
  static NONE = 'none';

  // Indicates that the Property has shared aggregation.
  static SHARED = 'shared';

  // Indicates that the Property is aggregated compositely, i.e., the composite object has responsibility for the existence and storage of the composed objects (parts).
  static COMPOSITE = 'composite';
}
