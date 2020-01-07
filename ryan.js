s = require('express')
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var sql = require("mssql");

var knex = require('knex')({
  client: 'mssql',
  connection: {
    host : 'sql-dw-dev',
    user : 'restapi',
    password : 'time-SUNDAY-etching-mark',
    database : 'EDW-Finance-Stage'
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

var pmdQuery = "SELECT \
secdept as department, \
SCRevType as revisionType, \
SCRevDescr as revisionDescription, \
SCAuthName as authorizedBy, \
SCAuthPosn as authorizedPosition, \
SCCurrentVal as currentValue,\
SCDeltaVal as deltaValue, \
secaccount as account, \
SCCommenceDate as contractStartDate, \
SCContractNum as contractNumber, \
SCExpiryDate as contractEndDate, \
SCContMgr as contractManager, \
SCAcqMethod as acquisitionMethod, \
SCValuePrice as acquisitionEvaluation, \
SCContractState as contractState \
FROM [Finance-Stage].[dbo].[PurContractDistFact] \
where SCContMgr = 'Ryan Agar'"


var contractQuery = function(contract){
q =  "SELECT \
scdeptname as department, \
SCRevType as revisionType, \
SCRevDescr as revisionDescription, \
SCAuthName as authorizedBy, \
SCAuthPosn as authorizedPosition, \
SCCurrentVal as currentValue,\
SCDeltaVal as deltaValue, \
secaccount as account, \
SCCommenceDate as contractStartDate, \
SCContractNum as contractNumber, \
SCExpiryDate as contractEndDate, \
SCContMgr as contractManager, \
SCAcqMethod as acquisitionMethod, \
SCValuePrice as acquisitionEvaluation, \
SCContractState as contractState \
FROM [Finance-Stage].[dbo].[PurContractDistFact] \
where SCContractNum = "

return (q + "'" + contract + "'")
}

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
//      res.send(contractQuery(req.params.contractNumber))
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
.from('PurContractDistFact')
.where({SCContractNum: req.params.contractNumber})
.then((response) => {
//      console.log(response)
  res.json(response)
})
//executeQuery (res, contractQuery(req.params.contractNumber));
});

app.get("/api/gl/:account", function(req , res){

knex.select()
.from('GLActualsFact')
.where({secaccount: req.params.account})
.then((response) => {
//      console.log(response)
  res.json(response)
})

});
app.get("/api/gl/:account/:contractNumber", function(req , res){

knex.select(
"GLActuals as invoiceAmount",
"JEDate",
"JEDescr as vendorId",
"JERefDate",
"JERef1 as contractNumber_JEREF1",
"JERef2 as invoiceNUmber",
"JEAuditUserid",
"JEAuditDate",
"secaccount as account")
.from('EDW-Finance-Stage.dbo.GLActualsFact')
.where({secaccount: req.params.account})
.where({JERef1: req.params.contractNumber })
.then((response) => {
//      console.log(response)
  res.json(response)
})

});

app.get("/cs/accounts/:accountNumber", function(req , res){
//      res.send(contractQuery(req.params.contractNumber))
knex.select(
  'Account as account',
  'deptDescr as department',
  'AcctDescr as accountDescription',
  'TypeDescr as type',
  'ActiveDescr as status',
  'ObjectDescr as objectDescription',
  'A2VoteDescr as voteDescription',
  'A2ProgDescr as programDescription',
  'A2ActivityDescr as activityDescription',
  'A2ElementDescr as elementDescription')
.from('GLAcctDim')
.where({account: req.params.accountNumber, dept:51})
.then((response) => {
//      console.log(response)
  res.json(response)
})
//executeQuery (res, contractQuery(req.params.contractNumber));
});

app.get("/cs/accounts", function(req , res){
//      res.send(contractQuery(req.params.contractNumber))
knex.select(
  'Account as account',
  'deptDescr as department',
  'AcctDescr as accountDescription',
  'TypeDescr as type',
  'ActiveDescr as status',
  'ObjectDescr as objectDescription',
  'A2VoteDescr as voteDescription',
  'A2ProgDescr as programDescription',
  'A2ActivityDescr as activityDescription',
  'A2ElementDescr as elementDescription')
.from('EDW-Finance-Stage.dbo.GLAcctDim')
.where({dept: '51'})
.then((response) => {
//      console.log(response)
  res.json(response)
})
//executeQuery (res, contractQuery(req.params.contractNumber));
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
