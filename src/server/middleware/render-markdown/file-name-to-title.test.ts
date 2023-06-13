import { fileNameToTitle } from './file-name-to-title';

describe('fileNameToTitle', () => {
  it.each([['/games/elden-ring.md', 'Games - elden ring']])(
    'should convert %p to $p',
    (path, title) => {
      expect(fileNameToTitle(path)).toEqual(title);
    },
  );
});
