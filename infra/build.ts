import { program } from 'commander';
import * as esbuild from 'esbuild';
import { join } from 'path';

const validEntries = ['server', 'lambda'] as const;
type ValidEntry = (typeof validEntries)[number];
const isValidEntry = (test: string): test is ValidEntry =>
  (validEntries as readonly string[]).includes(test);

program.requiredOption(
  '--entry <server or lambda>',
  'Either server or lambda',
);

program.parse();

const { entry } = program.opts() as {
  entry: string;
};

if (!isValidEntry(entry)) {
  throw new Error(`Entry must be either lambda or server`);
}

const entryPoint = (
  {
    server: `../src/server/server.ts`,
    lambda: `../src/server/lambda.ts`,
  } as const satisfies Record<ValidEntry, string>
)[entry];

esbuild.build({
  entryPoints: [join(__dirname, entryPoint)],
  bundle: true,
  minify: false,
  outdir: 'dist',
  platform: 'node',
  external: ['aws-sdk'],
  loader: {
    '.html': 'text',
  },
});
