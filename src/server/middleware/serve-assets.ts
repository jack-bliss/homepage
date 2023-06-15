import { NextFunction, Request, Response } from 'express';
import { getAsset } from '../services';
import { NotFoundError } from '../services/get-asset/not-found-error';
import { renderMarkdown } from './render-markdown';
import { fileNameToTitle } from './render-markdown/file-name-to-title';

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
  { file: 'pdf', content: 'application/pdf' },
] as const;

const defaultContentType = 'text/plain';

type ContentType =
  | (typeof fileTypeAndContentType)[number]['content']
  | typeof defaultContentType;

type FileType =
  | (typeof fileTypeAndContentType)[number]['file']
  | 'unknown';

function getContentType(path: string): {
  contentType: ContentType;
  fileType: FileType;
} {
  const type = fileTypeAndContentType.find(({ file }) => {
    return path.endsWith(`.${file}`);
  });
  return {
    fileType: type?.file || 'unknown',
    contentType: type?.content || defaultContentType,
  };
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
    const { contentType } = getContentType(path);
    const asset = await getAsset(path);
    if (contentType === 'text/markdown' && req.query.raw !== 'true') {
      res
        .type('text/html')
        .send(
          await renderMarkdown(
            fileNameToTitle(path),
            asset.toString('utf-8'),
          ),
        );
      return;
    }
    res.type(contentType).send(asset);
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      return next();
    }
    next(error);
  }
}
