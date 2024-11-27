import express from 'express';
const app = express();
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import 'express-async-errors';

import { NODE_ENV } from './configs/serve.config';

// import middlewares and routes
import router from './components';
import notFoundHandler from './libraries/errorHandler/notFoundHandler';
import errorHandler from './libraries/errorHandler/errorHandler';

// middlewares
app.use(cors());
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
    },
  })
);
app.use(compression());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/', router);

// error handler
router.use(notFoundHandler);
app.use(errorHandler);

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
