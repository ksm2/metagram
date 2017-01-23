import { BoundsVisitor } from '../visitors/BoundsVisitor';

export const URI = 'http://www.omg.org/spec/DD/20131001/DC';
export const visitors = {
  Bounds: new BoundsVisitor,
};

export default { URI, visitors };
