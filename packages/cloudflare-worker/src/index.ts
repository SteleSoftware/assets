import * as cache from './cache/';
import { middleware } from './middleware/';
import { ensureResponse } from './functions/response';
import { FetchEvent } from './type';

addEventListener('fetch', async (event: FetchEvent) => {
  let response;
  try {
    cache.setEvent(event);
    // response = ensureResponse(middleware(event.request));
    response = flow([
      middleware,
      result => Promise.resolve(result),
      ensureResponse,
    ])(event.request)
  } catch (err) {
    // log error
    response = new Response(null, {
      status: 500,
      statusText: 'Internal server error',
    });
  } finally {
    response.headers.append('X-Stele-Assets-Worker', '1');
    event.respondWith(response);
  }
});
