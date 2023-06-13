import express from 'express';
import { serveAssets } from './middleware/serve-assets';
import { handleError } from './middleware/handle-error';
import { home } from './pages/home';
import { notFound } from './pages/not-found';
import { articles } from './pages/articles';

export const app = express();

app.use('/', home);
app.use('/articles', articles);

app.use(serveAssets);

app.use('*', notFound);

app.use(handleError);
