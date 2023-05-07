import { join } from 'path';
import { readFile } from 'fs/promises';
import { NotFoundError } from './not-found-error';

export async function getFromLocal(path: string) {
  try {
    const totalPath = join(__dirname, '../bucket', path);
    return await readFile(totalPath);
  } catch (error: unknown) {
    if (!(error instanceof Error)) {
      throw error;
    }
    if (error instanceof Error && error.message.startsWith('ENOENT')) {
      throw new NotFoundError(path);
    }
    throw error;
  }
}
