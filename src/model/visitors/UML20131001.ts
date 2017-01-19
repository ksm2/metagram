import { AssociationVisitor } from './AssociationVisitor';
import { ClassVisitor } from './ClassVisitor';
import { ClassifierVisitor } from './ClassifierVisitor';
import { DataTypeVisitor } from './DataTypeVisitor';
import { EnumerationVisitor } from './EnumerationVisitor';
import { EnumerationLiteralVisitor } from './EnumerationLiteralVisitor';
import { PackageVisitor } from './PackageVisitor';
import { PrimitiveTypeVisitor } from './PrimitiveTypeVisitor';
import { PropertyVisitor } from './PropertyVisitor';

export {
  AssociationVisitor,
  ClassVisitor,
  ClassifierVisitor,
  DataTypeVisitor,
  EnumerationVisitor,
  EnumerationLiteralVisitor,
  PackageVisitor,
  PrimitiveTypeVisitor,
  PropertyVisitor,
}

export const URI = 'http://www.omg.org/spec/UML/20131001';
export const visitors = {
  Association: new AssociationVisitor(),
  Class: new ClassVisitor(),
  DataType: new DataTypeVisitor(),
  Enumeration: new EnumerationVisitor(),
  EnumerationLiteral: new EnumerationLiteralVisitor(),
  Package: new PackageVisitor(),
  PrimitiveType: new PrimitiveTypeVisitor(),
  Property: new PropertyVisitor(),
};

export default { URI, visitors };
