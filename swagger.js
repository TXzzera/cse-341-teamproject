const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Football Shirt Hub API',
        description: 'API for a hub of football shirts. Allows users to share opinions and information about various football shirts.',
    },
    host: 'cse-341-teamproject.onrender.com',
    schemes: ['https'],

    securityDefinitions: {
        SessionAuth: {
            type: 'apiKey',
            in: "header",
            name: "SessionAuth",
            description: "Authentication based in session. The cookie will be saved automatically by the browser after login."
        }
    },

    tags: [
    { name: 'Users', description: 'Manipulate informations of the users' },
    { name: 'Shirts', description: 'Add, Update, Delete or Request informations of the shirts' },
    { name: 'Stores', description: 'Add, Update, Delete or Request informations of the stores' },
    { name: 'Reviews', description: 'Request or submit reviews about shirts.' },
    { name: 'Authentication', description: 'User login and session management' },
    { name: 'Documentation', description: 'API Documentation'}],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
