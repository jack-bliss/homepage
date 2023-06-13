export function fileNameToTitle(name: string) {
  return name
    .replace('/', '') // remove first slash
    .replace(/-/g, ' ') // replace hyphens with spaces
    .replace(/\//g, ' - ') // replace other slashes with separators
    .replace('.md', '') // remove the file type
    .replace(/^([a-z])/gi, (match) => match.toUpperCase());
}
