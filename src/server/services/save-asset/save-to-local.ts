import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function saveToLocal(path: string, data: Buffer) {
  const totalPath = join(__dirname, '../bucket', path);
  return writeFile(totalPath, data);
}
