require('dotenv').config();

const express = require('express');
const routes = require('./routes/index.js');
const swagger = require('./routes/swagger.js');
const mongodb = require('./data/database.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;

const app = express();

app.use(bodyParser.json());

app.use(
  session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

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

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL 
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use('/', routes);      
app.use('/swagger', swagger); 

app.get('/', (req, res) => {
   res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : 'Logged Out');
  });

app.get('/github/callback',passport.authenticate('github', {
  failureRedirect: '/api-docs', session: false}), 
  (req, res) => {
  req.session.user = req.user;
  res.redirect('/');
});

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
