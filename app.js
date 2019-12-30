var express = require('express')
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var sql = require("mssql");

var environment = process.env.NODE_ENV || 'development'
var config = require('../db/knexfile.js')[environment]

var knex = require('knex')({
  client: 'mssql',
  connection: {
    host : 'sql-dw-prd',
    user : 'restapi',
    password : 'your_database_password',
    database : 'Finance-Stage'
  }
});

const jwtAuthz = require('express-jwt-authz');
const checkScopes = jwtAuthz([ 'read:messages' ]);

const app = express()
const port = 3001
const host = '0.0.0.0';

//Initiallising connection string
var dbConfig = {
  user:  "restapi",
  password: "told-anything-tail-moon",
  server: "sql-dw-prd",
  database: "Finance-Stage"
};

//Function to connect to database and execute query
var  executeQuery = function(res, query){
  sql.connect(dbConfig, function (err) {
      if (err) {
                  console.log("Error while connecting database :- " + err);
                  res.send(err);
               }
      else {
            // create Request object
            var request = new sql.Request();
            // query to the database
            request.query(query, function (err, result) {
              if (err) {
                          console.log("Error while querying database :- " + err);
                          res.send(err);
              }
              else {
                res.send(result);
              }
            });
          }
   });
}

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

  executeQuery (res, contractQuery(req.params.contractNumber));
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
