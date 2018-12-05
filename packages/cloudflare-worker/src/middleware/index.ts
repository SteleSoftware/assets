import { confine } from '../functions/generic';
import Authorize from './authorize';
import Bypass from './bypass';
import Cached from './cached';
import Query from './query';
import Serve from './serve';
import { Middleware, MiddlewareResult } from './type';
import Validate from './validate';

const MAX_EXE_TIME = 5000;

const middlewares = [
  Bypass,
  Cached,
  Validate,
  Query,
  Authorize,
  Serve,
];

type Result = Promise<MiddlewareResult> | MiddlewareResult;

/**
 *
 */
const apply = (
  stack: Middleware[],
  req: Request,
): Result => {
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
export const middleware = confine<Result>(
  apply.bind(null, middlewares),
  MAX_EXE_TIME,
);
