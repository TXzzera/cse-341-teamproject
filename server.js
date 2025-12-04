require('dotenv').config();

const express = require('express');
const routes = require('./routes/index.js');
const swagger = require('./routes/swagger.js');
const mongodb = require('./data/database.js');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Z-Key']
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});


app.use('/', routes);      
app.use('/swagger', swagger); 


process.on('uncaughtException', (err, origin) => {
  console.error(
    `Caught exception: ${err}\nException origin: ${origin}`
  );
});

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log('Server & Database running on port ' + PORT);
    });
  }
});
