var express = require('express')
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var sql = require("mssql");

var environment = process.env.NODE_ENV || 'development'
var config = require('../db/knexfile.js')[environment]
const knex = require('knex')(config);

const jwtAuthz = require('express-jwt-authz');
const checkScopes = jwtAuthz([ 'read:messages' ]);

const app = express()
const port = 3001
const host = '0.0.0.0';

//Initiallising connection string

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

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

//peron
app.get('/person/:ynetID', function(req, res) {
  res.send(req.params.ynetID);
  // knex.select('*')
  //   .from('?')
  //   .where({ynet:req.params.contractNumber})
  //   .then(function(sql_res){
  //     res.send(sql_res);
  //   });
});

app.get('/person/:ynetID/authorities', function(req, res) {
  res.send(req.params.ynetID + " authorities");
});

app.get('/person/:ynetID/card', function(req, res) {
  res.send(req.params.ynetID + " cards");
});

app.get('/person/:ynetID/transactions', function(req, res) {
  res.send(req.params.ynetID + " transactions");
});

app.get('/person/:ynetID/authorities', function(req, res) {
  res.send(req.params.ynetID + " authorities");
});

//account
app.get('/account/:account/authorities', function(req, res) {
  res.send(req.params.account + " authorities");
});

app.post('/account/:account/authorities', function(req, res) {
  res.send("create authroity " +req.params.account);
});

app.get('/authority/:authority', function(req, res) {
  res.send(req.params.authority + " authority");
});

app.post('/authority/:authority', function(req, res) {
  res.send("delete authroity " + req.params.authority);
});

app.post('/authority/:authority', function(req, res) {
  res.send("update authroity " + req.params.authority);
});

//transactions
app.get('/account/:authority/transactions', function(req, res) {
  res.send(req.params.authority + " transactions");
});

app.get('/account/:authority/transactions/:fiscalyear', function(req, res) {
  res.send(req.params.authority + " transactions for fiscal year " + req.params.fiscalyear);
});

//default?
app.get('/account/:department', function(req, res) {
  res.send("accounts in " + req.params.department);
});

app.get('/account/:department/:vote', function(req, res) {
  res.send("accounts in " + req.params.department + " that voted " + req.params.vote);
});

app.get('/account/:department/:vote/:program', function(req, res) {
  res.send("accounts in " + req.params.department + " that voted " + req.params.vote + " under program " + req.params.program);
});

app.get('/account/:department/:vote/:program/:object', function(req, res) {
  res.send("accounts in " + req.params.department + " that voted " + req.params.vote + " under program " + req.params.program + " with children " + req.params.object);
});

app.get('/account/:department/:vote/:program/:object/:ledger', function(req, res) {
  res.send("accounts in " + req.params.department + " that voted " + req.params.vote + " under program " + req.params.program + " with children " + req.params.object + " and subledgers " + req.params.ledger);
});

app.listen(port, host, () => console.log(`Contract API listening on host ${host} at port ${port}!`))
