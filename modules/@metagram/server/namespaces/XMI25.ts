import { XMIVisitor } from '../visitors/XMIVisitor';

export const URI = 'http://www.omg.org/spec/XMI/20131001';
export const visitors = {
  XMI: new XMIVisitor(),
};

export default { URI, visitors };
