import express from 'express';
import { serveAssets } from './middleware/serve-assets';
import { handleError } from './middleware/handle-error';
import { home } from './pages/home';
import { notFound } from './pages/not-found';

export const app = express();

app.use(serveAssets);

app.use('/', home);
app.use('*', notFound);

app.use(handleError);
