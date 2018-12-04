import { Middleware } from '../type';
import { Permissions } from '../../permissions';

export type Resolver = Middleware;

export type ResolverMap = {
  [permission in Permissions]: Resolver;
}
