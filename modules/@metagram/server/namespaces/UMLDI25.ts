import { ClassDiagramVisitor } from '../visitors/ClassDiagramVisitor';
import { ShapeVisitor } from '../visitors/ShapeVisitor';
import { EdgeVisitor } from '../visitors/EdgeVisitor';

export const URI = 'http://www.omg.org/spec/UML/20131001/UMLDI';
export const visitors = {
  UMLClassDiagram: new ClassDiagramVisitor(),
  UMLCompartmentableShape: new ShapeVisitor(),
  UMLEdge: new EdgeVisitor(),
};

export default { URI, visitors };
