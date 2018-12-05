import { get } from '@stele/assets-storage';
import { parsePath } from '../../functions/request';
import { NextMiddleware, MiddlewareResult } from '../type';
import { ResolverMap } from './type';
import { WorkerError, ErrorCodes } from '@stele/assets-exceptions';
import { Permissions } from '../../permissions';
import Public from './resolvers/public';
import Private from './resolvers/private';
import Protected from './resolvers/protected';
import Tech from './resolvers/tech';

const map: ResolverMap = {
  [Permissions.Public]: Public,
  [Permissions.Private]: Private,
  [Permissions.Protected]: Protected,
  [Permissions.Tech]: Tech,
};

export default async (
  next: NextMiddleware,
  req: Request,
): Promise<MiddlewareResult> => {
  const { app, version, asset } = parsePath(req.url);
  const access = get<number>(`${app}.assets.${asset}.${version}.access`);
  const resolver = map[access];
  if (!resolver) {
    throw new WorkerError({
      code: ErrorCodes.UnknownAccess,
      message: `Unknown access ${access}`,
    });
  }
  return resolver(next, req);
};
