import express from 'express';
const app = express();

import swaggerjsdoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express'; 

/**
 * Options for configuring the OpenAPI documentation.
 * 
 * @property {object} definition - The OpenAPI definition object.
 * @property {string} definition.openapi - The OpenAPI version.
 * @property {object} definition.info - Information about the API.
 * @property {string} definition.info.title - The title of the API documentation.
 * @property {string} definition.info.version - The version of the API.
 * @property {string} definition.info.description - A brief description of the API.
 * @property {object} definition.info.contact - Contact information for API support.
 * @property {string} definition.info.contact.name - The name of the API support contact.
 * @property {object[]} definition.servers - An array of server objects.
 * @property {string} definition.servers[].url - The URL of the server.
 * @property {string[]} apis - An array of paths to the API files.
 */
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
app.use('/', swaggerUI.serve, swaggerUI.setup(spacs));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`API Server is running on port ${PORT}`);
});
