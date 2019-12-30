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

app.get('/', (req, res) => res.send('Hello World!'))

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
  // knex.select('*')
  //   .from('?')
  //   .where({ynet:req.params.contractNumber})
  //   .then(function(sql_res){
  //     res.send(sql_res);
  //   });
});

app.get('/person/:ynetID/card', function(req, res) {
  res.send(req.params.ynetID + " cards");
  // knex.select('*')
  //   .from('?')
  //   .where({ynet:req.params.contractNumber})
  //   .then(function(sql_res){
  //     res.send(sql_res);
  //   });
});

app.get('/person/:ynetID/transactions', function(req, res) {
  res.send(req.params.ynetID + " transactions");
  // knex.select('*')
  //   .from('?')
  //   .where({ynet:req.params.contractNumber})
  //   .then(function(sql_res){
  //     res.send(sql_res);
  //   });
});

app.get('/person/:ynetID/authorities', function(req, res) {
  res.send(req.params.ynetID + " authorities");
  // knex.select('*')
  //   .from('?')
  //   .where({ynet:req.params.contractNumber})
  //   .then(function(sql_res){
  //     res.send(sql_res);
  //   });
});

//account
app.get('/account/:account/authorities', function(req, res) {
  res.send("test");
  // knex.select('*')
  //   .from('?')
  //   .where({ynet:req.params.contractNumber})
  //   .then(function(sql_res){
  //     res.send(sql_res);
  //   });
});

app.post('/account/:account/authorities', function(req, res) {
  res.send(req.params.account + " authorities")
});

app.listen(port, host, () => console.log(`Contract API listening on host ${host} at port ${port}!`))
