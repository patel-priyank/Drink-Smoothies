import express, { Request, Response } from 'express';

import cors from 'cors';

import smoothiesRoutes from './routes/smoothies.route';

const app = express();

app.use(cors());

app.use(express.json());

app.use(async (_req, _res, next) => {
  await new Promise(res => setTimeout(res, 800));
  next();
});

app.get('/', (_req: Request, res: Response): void => {
  res.json({ msg: 'API working.' });
});

app.use('/api/smoothies', smoothiesRoutes);

export default app;
