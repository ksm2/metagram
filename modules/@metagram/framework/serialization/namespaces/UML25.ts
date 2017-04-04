import { AssociationVisitor } from '../normalization/AssociationVisitor';
import { ClassVisitor } from '../normalization/ClassVisitor';
import { DataTypeVisitor } from '../normalization/DataTypeVisitor';
import { EnumerationLiteralVisitor } from '../normalization/EnumerationLiteralVisitor';
import { EnumerationVisitor } from '../normalization/EnumerationVisitor';
import { OperationVisitor } from '../normalization/OperationVisitor';
import { PackageVisitor } from '../normalization/PackageVisitor';
import { ParameterVisitor } from '../normalization/ParameterVisitor';
import { PrimitiveTypeVisitor } from '../normalization/PrimitiveTypeVisitor';
import { PropertyVisitor } from '../normalization/PropertyVisitor';

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
