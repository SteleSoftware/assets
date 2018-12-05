import { NextMiddleware, MiddlewareResult } from '../../type';

export default (next: NextMiddleware): MiddlewareResult => {
  next();
};
