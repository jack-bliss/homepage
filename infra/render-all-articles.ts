import { renderMarkdown } from '../src/render-markdown';

import { program } from 'commander';
import { join } from 'path';
import { readFile, readdir, writeFile } from 'fs/promises';
import { fileNameToTitle } from '../src/render-markdown/file-name-to-title';

program.parse();

async function main() {
  const files = await readdir(join(__dirname, '../src/articles'));
  await Promise.all(
    files.map(async (file) => {
      const markdown = await readFile(
        join(__dirname, '../src/articles', file),
        'utf-8',
      );
      const html = await renderMarkdown(
        fileNameToTitle(file),
        markdown.toString(),
      );
      await writeFile(
        join(
          __dirname,
          `../bucket/articles/${file.replace('.md', '.html')}`,
        ),
        html,
      );
    }),
  );
}

main()
  .then(() => console.info('done!'))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
