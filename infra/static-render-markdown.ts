import { renderMarkdown } from '../src/render-markdown';

import { program } from 'commander';
import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { fileNameToTitle } from '../src/render-markdown/file-name-to-title';

program.requiredOption(
  '--file <path>',
  'File name, relative to the src root',
);
program.requiredOption(
  '--out <path>',
  'Output path, relative to the bucket directory',
);

program.parse();

const { file, out } = program.opts() as {
  file: string;
  out: string;
};

async function main() {
  const markdown = await readFile(
    join(__dirname, '../src', file),
    'utf-8',
  );
  const result = await renderMarkdown(
    fileNameToTitle(file),
    markdown.toString(),
  );
  await writeFile(join(__dirname, `../bucket/${out}`), result);
}

main()
  .then(() => console.info('done!'))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
