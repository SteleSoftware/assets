import { parseParams } from '../../../functions/request';
import { AuthorizerMap } from '../type';
import { NextMiddleware, MiddlewareResult } from '../../type';
import Envato from '../schemes/envato';

const map: AuthorizerMap = {
  envato: Envato,
};

export default async (
  next: NextMiddleware,
  req: Request,
): Promise<MiddlewareResult> => {
  const { url } = req;
  const { scheme } = parseParams(url);
  const authorizer = map[scheme];
  if (!authorizer) {
    return new Response(null, {
      status: 403,
      statusText: `Invalid authorization scheme ${scheme}`,
    });
  }
  const authorized = await authorizer(req);
  if(!authorized) {
    return new Response(null, {
      status: 403,
      statusText: 'Authorization failed',
    });
  }
  next();
};
