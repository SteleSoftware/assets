import { Middleware, MiddlewareResult } from './type';
import { confine } from '../functions/generic';
import Bypass from './bypass';
import Cached from './cached';
import Validate from './validate';

import Authorize from './authorize';

const MAX_EXE_TIME = 5000;

const middlewares = [
  Bypass,
  Cached,
  Validate,
  DataQuery,
  Authorize,
  Serve,
];

/**
 * 
 */
const apply = (
  stack: Middleware[],
  req: Request,
): MiddlewareResult | Promise<MiddlewareResult> => {
  let current = 0;
  const next = () => {
    if (current < stack.length) {
      return stack[current++](next, req);
    }
  };
  return next();
};

/**
 * 
 */
export const middleware = confine<MiddlewareResult | Promise<MiddlewareResult>>(
  apply.bind(null, middlewares),
  MAX_EXE_TIME,
);
