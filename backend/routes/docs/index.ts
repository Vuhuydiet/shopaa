import express from 'express';
const router = express.Router();

import swaggerjsdoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express'; 

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'shopaa API Documentation',
      version: '1.0.0',
      description: 'API Documentation for shopaa',
      contact: {
        name: 'API Support',
      }
    },
    servers: [
      {
        url: 'http://localhost:3000'
      }
    ],
  },
  apis: ['../**/*.ts']
}
const spacs = swaggerjsdoc(options);
router.use('/', swaggerUI.serve, swaggerUI.setup(spacs));

export default router;
