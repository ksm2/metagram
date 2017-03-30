import { Enumeration } from '../../decorators';

/**
 * ParameterDirectionKind is an Enumeration that defines literals used to specify direction of parameters.
 */
@Enumeration('http://www.omg.org/spec/UML/20131001:ParameterDirectionKind')
export class ParameterDirectionKind {
  // Indicates that Parameter values are passed in by the caller.
  static IN = 'in';

  // Indicates that Parameter values are passed in by the caller and (possibly different) values passed out to the caller.
  static INOUT = 'inout';

  // Indicates that Parameter values are passed out to the caller.
  static OUT = 'out';

  // Indicates that Parameter values are passed as return values back to the caller.
  static RETURN = 'return';
}
