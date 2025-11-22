import { fileNameToTitle } from './file-name-to-title';

describe('fileNameToTitle', () => {
  it.each([
    ['/games/elden-ring.md', 'Games - Elden Ring'],
    ['articles/ec2-fleet-with-cdk.md', 'Articles - Ec2 Fleet With Cdk'],
  ])('should convert %p to $p', (path, title) => {
    expect(fileNameToTitle(path)).toEqual(title);
  });
});
