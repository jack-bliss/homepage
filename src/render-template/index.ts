export function renderTemplate(
  template: string,
  params: Record<string, string>,
) {
  let output = template;
  Object.entries(params).forEach(([key, value]) => {
    output = output.replace(new RegExp(`<!-- ${key} -->`, 'g'), value);
  });
  return output;
}
