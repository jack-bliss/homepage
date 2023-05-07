import { renderTemplate } from '../../services';
import template from '../template.html';
import { Router } from 'express';

export const notFound = Router();

notFound.get('*', (req, res) => {
  const page = renderTemplate(template, {
    title: '404',
    body: '<h1>404</h1>',
    styles: '<link href="bundles/styles.css" rel="stylesheet" />',
  });
  res.type('text/html').send(page);
});
