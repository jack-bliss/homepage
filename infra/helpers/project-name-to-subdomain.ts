export function projectNameToSubdomain(projectName: string) {
  return projectName
    .toLowerCase()
    .replace(/\s+/g, '-') // replace all strings of whitespace with a single hyphen
    .replace(/[^.-\w]/g, '') // get rid of anything other than ".", "-", and word characters
    .replace(/\W+/g, '-'); // replace any remaining symbols with a single hypen
}
