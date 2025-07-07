import { NextFunction, Response, Request } from 'express';
interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Something went wrong! Please try again';
  console.log(err);
  res.status(status).json({ message });
};

export default errorHandler;
