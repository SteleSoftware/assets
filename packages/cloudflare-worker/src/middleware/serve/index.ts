import { getSignedUrl } from '@stele/assets-storage';
import * as cache from '../../cache';
import { parsePath } from '../../functions/request'
import { NextMiddleware, MiddlewareResult } from '../type';

// @TODO
const isTech = false;

export default async (
  next: NextMiddleware,
  req: Request,
): Promise<MiddlewareResult> => {
  const { app, version, asset } = parsePath(req.url);
  const assetUrl = getSignedUrl({
    bucket: app,
    path: [version],
    object: asset,
    action: 'GET',
    expires: Date.now() + 5000,
  });
  const res = await fetch(assetUrl);
  const cacheLength = cache.getCacheLength(app);
  await cache.setHeaders(cacheLength, res);
  if (cacheLength && !isTech) {
    cache.put(req, res);
  }
  return res;
};
