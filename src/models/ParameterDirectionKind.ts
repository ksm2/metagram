/**
 * ParameterDirectionKind is an Enumeration that defines literals used to specify direction of parameters.
 */
export enum ParameterDirectionKind {
  in, // Indicates that Parameter values are passed in by the caller.
  inout, // Indicates that Parameter values are passed in by the caller and (possibly different) values passed out to the caller.
  out, // Indicates that Parameter values are passed out to the caller.
  return, // Indicates that Parameter values are passed as return values back to the caller.
}
