import { getFromBucket } from './get-from-bucket';
import { getFromLocal } from './get-from-local';

export function getAsset(path: string) {
  if (process.env.NODE_ENV === 'production') {
    return getFromBucket(path);
  }
  return getFromLocal(path);
}
