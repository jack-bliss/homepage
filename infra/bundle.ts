import * as esbuild from 'esbuild';
import { join } from 'path';

esbuild.build({
  entryPoints: [
    join(__dirname, `../src/client/page.tsx`),
    join(__dirname, `../src/client/styles.css`),
  ],
  bundle: true,
  minify: false,
  outdir: 'bucket/bundles',
  platform: 'browser',
});
