import type { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncRequestHandler<TReq extends Request = Request> = (
  req: TReq,
  res: Response,
  next: NextFunction,
) => Promise<unknown>;


const catchAsync = <TReq extends Request = Request>(
    fn: AsyncRequestHandler<TReq>): RequestHandler => {
  return (req, res, next) => {
    void fn(req as TReq, res, next).catch(next);
  };
}; 
 
export default catchAsync;

