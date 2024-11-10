const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Weather API',
      version: '1.0.0',
      description: 'Weather API documentation',
    },
  },
  apis: ['./main.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
