import { renderMarkdownFromAsset } from '../../middleware/render-markdown';
import { fileNameToTitle } from '../../middleware/render-markdown/file-name-to-title';
import { renderTemplate } from '../../services';
import template from '../template.html';
import { Router } from 'express';

export const articles = Router();

articles.get('/:slug', async (req, res, next) => {
  const { slug } = req.params;
  if (slug.endsWith('.png')) {
    return next();
  }
  const page = await renderMarkdownFromAsset(
    fileNameToTitle(slug),
    `articles/${slug}.md`,
  );
  res.type('text/html').send(page);
});

articles.get('/', (req, res) => {
  const page = renderTemplate(template, {
    title: `jackbliss.co.uk`,
    body: `<h1 class="main-title">Jack Bliss</h1>`,
    styles: '<link href="/bundles/splash.css" rel="stylesheet" />',
  });
  res.type('text/html').send(page);
});
