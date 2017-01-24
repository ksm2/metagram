/**
 * AggregationKind is an Enumeration for specifying the kind of aggregation of a Property.
 */
export enum AggregationKind {
  none = 0, // Indicates that the Property has no aggregation.
  shared, // Indicates that the Property has shared aggregation.
  composite, // Indicates that the Property is aggregated compositely, i.e., the composite object has responsibility for the existence and storage of the composed objects (parts).
}
