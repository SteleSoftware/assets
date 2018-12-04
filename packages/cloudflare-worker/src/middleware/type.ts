// export type MiddlewareResult = Promise<Response> | Response | never;
export type MiddlewareResult = Response | undefined | never;

export type NextMiddleware = () => Middleware;

export type Middleware = (next: () => Middleware, req: Request) => MiddlewareResult;
