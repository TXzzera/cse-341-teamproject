const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Football Shirt Hub API',
        description: 'API for a hub of football shirts. Allows users to share opinions and information about various football shirts.',
    },
    host: 'cse-341-teamproject.onrender.com',
    schemes: ['https'],
    tags: [
    { name: 'Users', description: 'Manipulate informations of the users' },
    { name: 'Shirts', description: 'Add, Update, Delete or Request informations of the shirts' },]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
