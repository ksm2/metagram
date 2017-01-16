import { ClassVisitor } from './ClassVisitor';
import { EnumerationVisitor } from './EnumerationVisitor';
import { EnumerationLiteralVisitor } from './EnumerationLiteralVisitor';
import { PackageVisitor } from './PackageVisitor';
import { PrimitiveTypeVisitor } from './PrimitiveTypeVisitor';
import { PropertyVisitor } from './PropertyVisitor';

export {
  ClassVisitor,
  EnumerationVisitor,
  EnumerationLiteralVisitor,
  PackageVisitor,
  PrimitiveTypeVisitor,
  PropertyVisitor,
}

export const URI = 'http://www.omg.org/spec/UML/20131001';
export const visitors = {
  Class: new ClassVisitor(),
  Enumeration: new EnumerationVisitor(),
  EnumerationLiteral: new EnumerationLiteralVisitor(),
  Package: new PackageVisitor(),
  PrimitiveType: new PrimitiveTypeVisitor(),
  Property: new PropertyVisitor(),
};

export default { URI, visitors };
