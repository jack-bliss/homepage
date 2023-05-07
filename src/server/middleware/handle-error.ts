import { NextFunction, Request, Response } from 'express';

export async function handleError(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const now = Date.now();
  console.error({
    timestamp: now,
    path: req.path,
    message: error.message,
    error,
  });
  return res.send(String(now));
}
