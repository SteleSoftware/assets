export type MiddlewareResult = Response | void | never;

export type NextMiddleware = () => Middleware;

export type Middleware = (next: () => Middleware, req: Request) => MiddlewareResult;
