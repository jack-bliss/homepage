export class NotFoundError extends Error {
  path: string;
  constructor(path: string) {
    super(`No object found at ${path}`);
    this.path = path;
  }
}
