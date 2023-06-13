import { renderTemplate } from '../../services';
import template from '../template.html';
import { Router } from 'express';

export const notFound = Router();

notFound.get('*', (req, res) => {
  const page = renderTemplate(template, {
    title: '404',
    body: '<h1 class="main-title">404</h1>',
    styles: '<link rel="stylesheet" href="/bundles/splash.css" />',
  });
  res.type('text/html').status(404).send(page);
});
