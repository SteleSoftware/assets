import { NextMiddleware, MiddlewareResult } from '../type';
import { Permissions } from '../../permissions';

export type Resolver = (next: NextMiddleware, req?: Request) => MiddlewareResult | Promise<MiddlewareResult>;

export type ResolverMap = {
  [permission in Permissions]: Resolver;
}

type AuthorizationSchemes = 'envato';

export type Authorizer = (req: Request) => Promise<boolean> | boolean;

export type AuthorizerMap = {
  [scheme in AuthorizationSchemes]: Authorizer;
}
