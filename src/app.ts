import express from 'express';
import { errorHandlingMiddleware } from '@/middlewares/errorHandlingMiddleware';
import { AppError } from './utils/AppError';

const app = express();

app.use(express.json());

app.get("/", (req, res) => {

  return res.send("Hello World");
});

app.use(errorHandlingMiddleware)

export { app }