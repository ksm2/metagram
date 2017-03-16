import { ClassDiagramVisitor } from '../normalization/ClassDiagramVisitor';
import { ShapeVisitor } from '../normalization/ShapeVisitor';
import { EdgeVisitor } from '../normalization/EdgeVisitor';

export const URI = 'http://www.omg.org/spec/DD/20131001/DI';
export const visitors = {
  Diagram: new ClassDiagramVisitor(),
  Shape: new ShapeVisitor(),
  Edge: new EdgeVisitor(),
};

export default { URI, visitors };
