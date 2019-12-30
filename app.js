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

app.get('/knex', function(req, res) {
  knex.select('*').from('quest.budget_profiles').then(function(sql_res){
    res.send(sql_res);
  });
});

app.get('/account/:account/transactions', function(req, res) {
  res.send("Last 30 days of transactions for account: " + req.params.account);
});

app.get('/contract', function(req, res) {
  res.send("Last 30 days of transactions for account: " + pmdQuery);
});

//GET API
app.get("/api/contract/:contractNumber", function(req , res){
  //	res.send(contractQuery(req.params.contractNumber))
  knex.select(
    'scdeptname as department',
    'SCRevType as revisionType',
    'SCRevDescr as revisionDescription',
    'SCAuthName as authorizedBy',
    'SCAuthPosn as authorizedPosition',
    'SCCurrentVal as currentValue',
    'SCDeltaVal as deltaValue',
    'secaccount as account',
    'SCCommenceDate as contractStartDate',
    'SCContractNum as contractNumber',
    'SCExpiryDate as contractEndDate',
    'SCContMgr as contractManager',
    'SCAcqMethod as acquisitionMethod',
    'SCValuePrice as acquisitionEvaluation',
    'SCContractState as contractState')
  .from('[Finance-Stage].[dbo].[PurContractDistFact]')
  .where({SCContractNum: req.params.contractNumber})
});

//app.use(jwtCheck);

app.get('/authorized', jwtCheck, function (req, res) {
  res.json({message: ' Hello from a private endpoint!'});
});

app.get('/api/private-scoped', jwtCheck, checkScopes, function(req, res) {
  res.json({
    message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
  });
});

app.listen(port, host, () => console.log(`Contract API listening on host ${host} at port ${port}!`))
