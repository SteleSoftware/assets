import * as flow from 'lodash.flow';
import * as cache from './cache/';
import { middleware } from './middleware/';
import { ensureResponse } from './functions/response';
import { FetchEvent, ErrorHandlerParams } from './type';

/**
 * 
 */
const processRequest = (event: FetchEvent): Response => {
  cache.setEvent(event);
  return flow([
    middleware,
    Promise.resolve,
    ensureResponse,
  ])(event.request);
};

/**
 * 
 */
const handleError = ({
  event,
  req,
  res,
  error,
}: ErrorHandlerParams): Response => {
  // log error
  return new Response(null, {
    status: 500,
    statusText: 'Internal server error',
  });
};

/**
 * 
 */
const respond = (event: FetchEvent, res: Response) => {
  res.headers.append('X-Stele-Assets-Worker', '1');
  event.respondWith(res);
};

/**
 * 
 */
addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  let response;
  try {
    response = processRequest(event);
  } catch (error) {
    response = handleError({
      event,
      error,
      req: request,
      res: response,
    });
  } finally {
    respond(event, response);
  }
});
