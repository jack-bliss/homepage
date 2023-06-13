import { renderMarkdown } from '../src/server/middleware/render-markdown';

import { program } from 'commander';
import { getFromLocal } from '../src/server/services/get-asset/get-from-local';
import { join } from 'path';
import { writeFile } from 'fs/promises';

program.requiredOption(
  '--file <path>',
  'File name, relative to the bucket directory',
);

program.parse();

const { file } = program.opts() as {
  file: string;
};

async function main() {
  const markdown = await getFromLocal(join('../bucket', file));
  const result = await renderMarkdown(file, markdown.toString());
  await writeFile(`./bucket/${file.replace('.md', '.html')}`, result);
}

main()
  .then(() => console.info('done!'))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
