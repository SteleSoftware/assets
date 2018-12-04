import { parsePath } from '../../functions/request';
import { NextMiddleware, MiddlewareResult } from '../type';

export default (next: NextMiddleware, req: Request): MiddlewareResult => {
  const { app, version, asset } = parsePath(req.url);
  if (!app || !version || !asset) {
    return new Response(null, {
      status: 403,
      statusText: `Invalid path: ${JSON.stringify({ app, version, asset })}`,
    });
  }
  next();
};
