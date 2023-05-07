import { program } from 'commander';
import * as esbuild from 'esbuild';
import { join } from 'path';

const validEntries = ['server', 'lambda'] as const;
type ValidEntry = (typeof validEntries)[number];
const isValidEntry = (test: string): test is ValidEntry =>
  (validEntries as readonly string[]).includes(test);

program.requiredOption(
  '--target <server or lambda>',
  'Either server or lambda',
);

program.parse();

const { target } = program.opts() as {
  target: string;
};

if (!isValidEntry(target)) {
  throw new Error(`Target must be either lambda or server`);
}

esbuild.build({
  entryPoints: [join(__dirname, `../src/server/${target}.ts`)],
  bundle: true,
  minify: false,
  outdir: 'dist',
  platform: 'node',
  external: ['aws-sdk'],
  loader: {
    '.html': 'text',
  },
});
