//
// Express REST API Server
//
// Author: Fairbanks-io (https://github.com/Fairbanks-io)
//
// Options:
//    - SESSION_SECRET: Either a string or array of secrets used to sign the session ID cookie (If array: first is used to sign, others are used to verify)
//    - LOGGING: If 'true', an access.log will be created for incoming site requests using Morgan logging
//    - RATE_LIMIT: If 'true', enables DDoS and RateLimit protections through Express
//    - SITE_ROOT: If set to a string, that path will be used as the default site root instead of the default of 'public'

// Import dependencies
const express = require('express'),
  Ddos = require('ddos'),
  RateLimit = require('express-rate-limit'),
  fs = require('fs'),
  path = require('path'),
  morgan = require('morgan'),
  session = require('express-session'),
  lusca = require('lusca'),
  bodyParser = require('body-parser'),
  cors = require('cors'),
  passport = require("passport"),
  routes = require('./routes');
  mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }); //use new url parser to supress warnings
mongoose.set('useCreateIndex', true); //hide warnings about deprecation of 'ensureIndex'
mongoose.Promise = global.Promise;

// Initialize Express
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));

// Setup Session Management & Lusca
if(!process.env.SESSION_SECRET){ console.warn("SESSION_SECRET not passed. Using a default value."); }
app.use(session({
	secret: process.env.SESSION_SECRET || "MySessionSecret",
	resave: false,
  maxAge: 3600000,
	saveUninitialized: true,
  cookie: { secure: true }
}))

// Enable CORS
app.use(cors())

// Configure Lusca
app.use(lusca({
  csrf: false, // Requires setting allowed CSRF. TODO: allow whitelist via env var? enable only if values provided
  csp: false, // Set a valid CSP if desired - https://hacks.mozilla.org/2016/02/implementing-content-security-policy/
  xframe: 'SAMEORIGIN',
  hsts: {maxAge: 31536000, includeSubDomains: true, preload: true},
  xssProtection: false,
  nosniff: true,
  referrerPolicy: 'same-origin'
}))

// Set additional headers and other middlewares if required
app.use(function(req, res, next) {
  res.setHeader('X-Timestamp', Date.now()) // Tag all requests with a timestamp
  res.setHeader('X-Words-of-Wisdom', '"You come at the king, you best not miss." - Omar Little') // Yo dawg...
  next();
})

// Create a write stream to log requests (a = append)
if(process.env.LOGGING == true) {
  var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
  app.use(morgan('short', {stream: accessLogStream}))
}

// Setup DDoS & Rate Limiting
if(process.env.RATE_LIMIT == true) {
  const ddos = new Ddos({burst:10, limit:15})
  const limiter = new RateLimit({
    windowMs: 15*60*1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    delayMs: 0 // disable delaying - full speed until the max limit is reached
  })
  app.use(ddos.express)
  app.use('/', limiter)
}

app.disable('x-powered-by') // Disable Express' "X-Powered-By" Header

var port = null;
if(process.env.PORT){ port = process.env.PORT; }else{ port = 8888; } // Default port is 8888 unless passed

app.disable('x-powered-by') // Disables Express' "X-Powered-By" Header

// Initialize and configure passport to use session.
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

// Tell Express where to route requests
app.use('/', routes);

// Configure port and start listening
const port = process.env.PORT ? process.env.PORT : 3000 // Default port is 3000 unless passed
app.listen(port, () => console.log('App Listening on Port ' + port))
