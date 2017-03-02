import { AssociationVisitor } from '../visitors/AssociationVisitor';
import { ClassVisitor } from '../visitors/ClassVisitor';
import { DataTypeVisitor } from '../visitors/DataTypeVisitor';
import { EnumerationVisitor } from '../visitors/EnumerationVisitor';
import { EnumerationLiteralVisitor } from '../visitors/EnumerationLiteralVisitor';
import { OperationVisitor } from '../visitors/OperationVisitor';
import { PackageVisitor } from '../visitors/PackageVisitor';
import { ParameterVisitor } from '../visitors/ParameterVisitor';
import { PrimitiveTypeVisitor } from '../visitors/PrimitiveTypeVisitor';
import { PropertyVisitor } from '../visitors/PropertyVisitor';

export const URI = 'http://www.omg.org/spec/UML/20131001';
export const visitors = {
  Association: new AssociationVisitor(),
  Class: new ClassVisitor(),
  DataType: new DataTypeVisitor(),
  Enumeration: new EnumerationVisitor(),
  EnumerationLiteral: new EnumerationLiteralVisitor(),
  Operation: new OperationVisitor(),
  Package: new PackageVisitor(),
  Parameter: new ParameterVisitor(),
  PrimitiveType: new PrimitiveTypeVisitor(),
  Property: new PropertyVisitor(),
};

export default { URI, visitors };
