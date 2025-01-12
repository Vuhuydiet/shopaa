import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();
import cors from 'cors';

import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import 'express-async-errors';

import { NODE_ENV } from './configs/serve.config.js';

// import middlewares and routes
import router from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';

// middlewares
app.use(cors());
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(helmet());
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/', router);

// error handler
app.use(errorHandler);

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
