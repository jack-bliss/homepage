import { saveToBucket } from './save-to-bucket';
import { saveToLocal } from './save-to-local';

export function saveAsset(path: string, data: Buffer) {
  if (process.env.NODE_ENV === 'production') {
    return saveToBucket(path, data);
  }
  return saveToLocal(path, data);
}
