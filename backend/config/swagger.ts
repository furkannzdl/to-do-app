
const swaggerJSDoc = require('swagger-jsdoc');

// Swagger definition
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
      description: 'This is the API documentation for the Todo App',
      contact: {
        name: 'Your Name',
        email: 'your-email@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5001/api', // base URL for your API
      },
    ],
  },
  // Paths to files where API definitions exist
  apis: ['./routes/*.js'], // Specify the path to your route files where API documentation is annotated
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
