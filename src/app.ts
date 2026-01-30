import express from 'express';
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js';
import { routes } from './routes.js';

const app = express();

app.use(express.json());

app.use(routes);

app.use(errorHandlingMiddleware)

export { app }
