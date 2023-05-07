import { PORT, PROJECT_NAME } from '../../infra/app';
import { app } from './router';

app.listen(PORT, () =>
  console.info(`${PROJECT_NAME} listening on port ${PORT}`),
);
