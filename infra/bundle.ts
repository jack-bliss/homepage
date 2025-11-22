import * as esbuild from 'esbuild';
import { join } from 'path';

esbuild.build({
  entryPoints: [
    join(__dirname, `../src/client/splash.css`),
    join(__dirname, `../src/client/article.css`),
  ],
  bundle: true,
  minify: false,
  outdir: 'bucket/bundles',
  platform: 'browser',
});
