import serverlessExpress from '@vendia/serverless-express';
import { app } from './router';

export const handler = serverlessExpress({
  app,
});
