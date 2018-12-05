import { MiddlewareResult } from '../../type';

export default (): MiddlewareResult => new Response(null, {
  status: 403,
  statusText: 'Tech assets not implemented',
});
