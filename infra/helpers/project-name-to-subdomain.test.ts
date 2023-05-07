import { projectNameToSubdomain } from './project-name-to-subdomain';

describe('projextNameToSubdomain', () => {
  it.each([
    ['hello-world', 'hello-world'],
    ['hello.world', 'hello-world'],
    ['hello world', 'hello-world'],
    ['hello world.how are 1234 you?', 'hello-world-how-are-1234-you'],
    ['this - and i mean this - is weird', 'this-and-i-mean-this-is-weird'],
  ])('should correctly parse %p into %p', (projectName, subdomain) => {
    expect(projectNameToSubdomain(projectName)).toEqual(subdomain);
  });
});
