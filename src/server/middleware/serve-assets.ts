import { NextFunction, Request, Response } from 'express';
import { getAsset } from '../services';
import { NotFoundError } from '../services/get-asset/not-found-error';

const fileTypeAndContentType = [
  { file: 'css', content: 'text/css' },
  { file: 'js', content: 'text/javascript' },
  { file: 'json', content: 'application/json' },
  { file: 'yaml', content: 'text/yaml' },
  { file: 'html', content: 'text/html' },
  { file: 'md', content: 'text/markdown' },
  { file: 'png', content: 'image/png' },
  { file: 'jpg', content: 'image/jpeg' },
  { file: 'jpeg', content: 'image/jpeg' },
  { file: 'gif', content: 'image/gif' },
  { file: 'svg', content: 'image/svg+xml' },
  { file: 'ico', content: 'image/x-icon' },
] as const;

const defaultContentType = 'text/plain';

function getContentType(path: string) {
  const type = fileTypeAndContentType.find(({ file }) => {
    return path.endsWith(`.${file}`);
  });
  return type?.content || defaultContentType;
}

export async function serveAssets(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { path } = req;
  if (path.endsWith('/')) {
    return next();
  }
  try {
    const asset = await getAsset(path);
    const contentType = getContentType(path);
    res.type(contentType).send(asset);
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      return next();
    }
    next(error);
  }
}
