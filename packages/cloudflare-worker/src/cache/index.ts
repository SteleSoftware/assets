import * as njscrypto from 'crypto';
import * as storage from '@stele/assets-storage';
import { overwriteHeaders } from '../functions/response';
import { FetchEvent } from '../type';

interface CloudFlareCacheStorage {
  default: CacheStorage & {
    put: (arg: string | Request, res: Response) => any;
  };
} 

let event;
const cache = (caches as unknown as CloudFlareCacheStorage).default;

/**
 * 
 */
export const setEvent = (fetchEvent: FetchEvent): void => {
  event = fetchEvent;
};

/**
 * 
 */
const getKey = (req: Request): string => {
  const { url, headers } = req;
  const referer = headers.get('referer');
  if (!referer) {
    return '';
  }
  return `${referer}:${url}`;
};

/**
 * 
 */
// @TODO: memoize
export const getMatch = (req: Request): Promise<Response | undefined> =>
  cache.match(getKey(req));

/**
 * 
 */
const put = (req: Request, res: Response): boolean => {
  if (!event) {
    return false;
  }
  const key = getKey(req);
  if (!key) {
    return false;
  }
  event.waitUntil(cache.put(key, res.clone()));
  return true;
};

/**
 * 
 */
const getCacheLength = (app: string): number =>
  parseInt(storage.get(`${app}.cache`), 10) || 0;

/**
 * 
 */
const setHeaders = async (seconds: number, res: Response): Promise<void> => {
  if (seconds) {
    const body = await res.clone().body.getReader().read();
    const date = new Date();
    date.setSeconds(date.getSeconds() + seconds);
    overwriteHeaders(res, {
      'Cache-Control': `public, max-age=${seconds}, must-revalidate`,
      Expires: date.toUTCString(),
      ETag: njscrypto.createHash('md5').update(body).digest('hex'),
    });
  } else {
    overwriteHeaders(res, {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Expires: '0',
    });
  }
};
