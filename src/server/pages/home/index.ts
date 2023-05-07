import { renderTemplate } from '../../services';
import template from '../template.html';
import { Router } from 'express';

export const home = Router();

home.get('/', (req, res) => {
  const page = renderTemplate(template, {
    title: `jackbliss.co.uk`,
    body: `<h1>Jack Bliss</h1>`,
    styles: '<link href="bundles/styles.css" rel="stylesheet" />',
  });
  res.type('text/html').send(page);
});
