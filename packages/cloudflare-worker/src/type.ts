import { WorkerError } from '@stele/assets-exceptions';

export interface FetchEvent extends Event {
	request: Request;
	respondWith(response: Promise<Response>|Response): Promise<Response>;
}

export interface ErrorHandlerParams {
  event: FetchEvent;
  req: Request;
  res: Response;
  error: WorkerError | Error;
}
