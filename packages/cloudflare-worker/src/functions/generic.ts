import { ErrorCodes, WorkerError } from '@stele/assets-exceptions';

type ConfineFunc = <T>(fn: (args?: any) => any, limit: number) => (...args: any[]) => T | never;

/**
 * 
 */
export const confine: ConfineFunc = (fn, limit) => (...args) => {
  const timeout = setTimeout((): never => {
    throw new WorkerError({
      code: ErrorCodes.ExceededExecutionTime,
      message: `Max executiont ime of ${limit} exceeded`,
    });
  }, limit);
  const result = fn(...args);
  clearTimeout(timeout);
  return result;
};
