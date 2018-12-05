import { fetchFromStorage } from '@stele/assets-storage';
import { parsePath } from '../../functions/request';
import { NextMiddleware, MiddlewareResult } from '../type';

export default async (
  next: NextMiddleware,
  req: Request,
): Promise<MiddlewareResult> => {
  const { app } = parsePath(req.url);
  await fetchFromStorage(app);
  next();
};
