import { ClassDiagramVisitor } from '../visitors/ClassDiagramVisitor';
import { ShapeVisitor } from '../visitors/ShapeVisitor';
import { EdgeVisitor } from '../visitors/EdgeVisitor';

export const URI = 'http://www.omg.org/spec/DD/20131001/DI';
export const visitors = {
  Diagram: new ClassDiagramVisitor(),
  Shape: new ShapeVisitor(),
  Edge: new EdgeVisitor(),
};

export default { URI, visitors };
