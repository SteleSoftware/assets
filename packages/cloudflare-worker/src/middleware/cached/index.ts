import { getMatch } from '../../cache'
import { NextMiddleware, MiddlewareResult } from '../type';

export default async (
  next: NextMiddleware,
  req: Request,
): Promise<MiddlewareResult> => {
  const response = await getMatch(req);
  if (response) {
    return response;
  }
  next();
};
