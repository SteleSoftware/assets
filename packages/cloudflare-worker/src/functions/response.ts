import { ErrorCodes, WorkerError } from '@stele/assets-exceptions';

/**
 * 
 */
export const ensureResponse = (res: unknown): Response | never => {
  if (!(res instanceof Response)) {
    throw new WorkerError({
      code: ErrorCodes.InvalidResponse,
      message: `${typeof res} is not a valid response object`,
    });
  }
  return res;
}

/**
 *  
 */
export const overwriteHeaders = (
  res: Response,
  newHeaders: object,
): void => Array
  .from(Object.entries(newHeaders))
  .forEach(([header, value]) => res.headers.set(header, value));
