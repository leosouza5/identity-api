import express from 'express';
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware.js';
import { userRoutes } from './routes/userRoutes.js';

const app = express();

app.use(express.json());

app.use('/users', userRoutes);

app.use(errorHandlingMiddleware)

export { app }