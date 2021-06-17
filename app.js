const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const sql = require("mssql")
const moment = require('moment')

const { dbHost } = require('./config/config')
const { dbUser } = require('./config/config')
const { dbPassword } = require('./config/config')
const { db } = require('./config/config')

const knex = require('knex')({
  client: 'mssql',
  connection: {
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: db
  }
});

const jwtAuthz = require('express-jwt-authz');
const { body, validationResult } = require('express-validator')
const { GLRouter } = require('./routes/gl')
const checkScopes = jwtAuthz(['read:messages']);

const app = express()
const port = 3034
const host = '0.0.0.0';

var glRoutes = require('./routes/gl')
glRoutes(app)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://cirque.auth0.com/.well-known/jwks.json"
  }),
  audience: 'https://quickstarts/api',
  issuer: "https://cirque.auth0.com/",
  algorithms: ['RS256']
});


app.use(express.static('public'))

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/account/:account/transactions', function (req, res) {
  res.send("Last 30 days of transactions for account: " + req.params.account);
});

app.get('/contract', function (req, res) {
  res.send("Last 30 days of transactions for account: " + pmdQuery);
});


app.get('/authorized', jwtCheck, function (req, res) {
  res.json({ message: ' Hello from a private endpoint!' });
});

app.get('/api/private-scoped', jwtCheck, checkScopes, function (req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
  });
});

app.listen(port, host, () => console.log(`Contract API listening on host ${host} at port ${port}!`))
