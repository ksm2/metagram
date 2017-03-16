import { BoundsVisitor } from '../normalization/BoundsVisitor';
import { PointVisitor } from '../normalization/PointVisitor';

export const URI = 'http://www.omg.org/spec/DD/20131001/DC';
export const visitors = {
  Bounds: new BoundsVisitor,
  Point: new PointVisitor,
};

export default { URI, visitors };
