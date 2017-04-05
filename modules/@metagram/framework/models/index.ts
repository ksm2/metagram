export { AggregationKind } from './uml/AggregationKind';
export { Association } from './uml/Association';
export { Class } from './uml/Class';
export { Classifier } from './uml/Classifier';
export { DataType } from './uml/DataType';
export { DirectedRelationship } from './uml/DirectedRelationship';
export { Enumeration } from './uml/Enumeration';
export { EnumerationLiteral } from './uml/EnumerationLiteral';
export { Generalization } from './uml/Generalization';
export { ModelElement } from './uml/ModelElement';
export { Operation } from './uml/Operation';
export { Package } from './uml/Package';
export { PackageImport } from './uml/PackageImport';
export { Parameter } from './uml/Parameter';
export { ParameterDirectionKind } from './uml/ParameterDirectionKind';
export { PrimitiveType } from './uml/PrimitiveType';
export { Property } from './uml/Property';
export { Type } from './uml/Type';
export { TypedElement } from './uml/TypedElement';
export { VisibilityKind } from './uml/VisibilityKind';

export * from './metamodel';
export * from './xmi';

export const KNOWN_MODELS = new Map([
  [
    'http://www.omg.org/spec/XMI/20131001',
    {
      name: 'XMI',
      version: '2.5.1',
      xmi: 'http://www.omg.org/spec/XMI/20131001/XMI-model.xmi',
    }
  ], [
    'http://www.omg.org/spec/UML/20131001',
    {
      name: 'UML',
      version: '2.5',
      xmi: 'http://www.omg.org/spec/UML/20131001/UML.xmi',
    }
  ], [
    'http://www.omg.org/spec/DD/20131001/DC',
    {
      name: 'Diagram Common',
      version: '1.1',
      xmi: 'http://www.omg.org/spec/DD/20131001/DC.xmi',
    }
  ], [
    'http://www.omg.org/spec/DD/20131001/DI',
    {
      name: 'Diagram Interchange',
      version: '1.1',
      xmi: 'http://www.omg.org/spec/DD/20131001/DI.xmi',
    }
  ],
]);
