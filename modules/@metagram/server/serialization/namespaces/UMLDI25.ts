import { ClassDiagramVisitor } from '../normalization/ClassDiagramVisitor';
import { ShapeVisitor } from '../normalization/ShapeVisitor';
import { EdgeVisitor } from '../normalization/EdgeVisitor';

export const URI = 'http://www.omg.org/spec/UML/20131001/UMLDI';
export const visitors = {
  UMLClassDiagram: new ClassDiagramVisitor(),
  UMLCompartmentableShape: new ShapeVisitor(),
  UMLEdge: new EdgeVisitor(),
};

export default { URI, visitors };
