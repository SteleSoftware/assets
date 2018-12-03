import { StorageFetchError } from '@stele/assets-exceptions';
import { ErrorCodes } from '@stele/assets-exceptions';
import * as _get from 'lodash.get';
import * as _has from 'lodash.has';
import * as _set from 'lodash.set';
import { getSignedUrl } from './gcs';

type AsyncStorageOperation<T> = (app: string) => Promise<T | undefined | never>;

const DATA_FILE = '_data.json';

const fetched = {};

/**
 *
 */
export const has = (path: string): boolean =>
  _has(fetched, path);

/**
 *
 */
export const set = (path: string, value: any): object =>
  _set(fetched, path, value);

/**
 *
 */
export const get = <T>(path: string, defaultVal: any = null): T | null =>
  _get(fetched, path, defaultVal);

/**
 *
 */
export const fetchFromStorage: AsyncStorageOperation<object> = async app => {
  if (!has(app)) {
    const url = getSignedUrl({
      bucket: app,
      object: DATA_FILE,
      action: 'GET',
      expires: Date.now() + 5000,
    });
    const res = await fetch(url);
    const contents = await res.body.getReader().read();
    if (!contents) {
      throw new StorageFetchError({
        code: ErrorCodes.StorageFetchError,
        message: `Could not fetch ${DATA_FILE} for bucket ${app}`,
      });
    }
    fetched[app] = JSON.parse(contents);
  }
  return fetched[app];
};

/**
 *
 */
export const persistToStorage: AsyncStorageOperation<boolean> = async app => {
  if (!has(app)) {
    return false;
  }
  const contents = JSON.stringify(fetched[app]);
  const url = getSignedUrl({
    bucket: app,
    object: DATA_FILE,
    action: 'PUT',
    expires: Date.now() + 5000,
  });
  const res = await fetch(url, {
    method: 'PUT',
    body: contents,
  });
  if (res.status !== 200) { // @TODO: this should be smarter/flexible
    throw new StorageFetchError({
      code: ErrorCodes.StorageFetchError,
      message: `Could not put ${DATA_FILE} for bucket ${app}`,
    });
  }
  return true;
};
