import { NextMiddleware, MiddlewareResult } from '../type';
import { isRequestForAsset } from '../../functions/request';

export default (next: NextMiddleware, req: Request): MiddlewareResult => {
  const { url } = req;
  const { pathname } = new URL(url);
  if (!isRequestForAsset(pathname)) {
    return fetch(req);
  }
  next();
};
