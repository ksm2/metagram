import { Enumeration } from '../decorators';

/**
 * VisibilityKind is an enumeration type that defines literals to determine the visibility of Elements in a model.
 */
@Enumeration('http://www.omg.org/spec/UML/20131001:VisibilityKind')
export class VisibilityKind {
  static PUBLIC = 'public';
  static PRIVATE = 'private';
  static PROTECTED = 'protected';
  static PACKAGE = 'package';
}
