const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const sql = require("mssql")
const moment = require('moment')

const {dbHost} = require('./config')
const {dbUser} = require('./config')
const {dbPassword} = require('./config')
const {db} = require('./config')

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
const checkScopes = jwtAuthz(['read:messages']);

const app = express()
const port = 3034
const host = '0.0.0.0';

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

//GET API
app.get("/api/contract/:contractNumber", function (req, res) {
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
    .from('PurContractDistFact')
    .where({ SCContractNum: req.params.contractNumber })
    .then((response) => {
      //	console.log(response)
      res.json(response)
    })
  //executeQuery (res, contractQuery(req.params.contractNumber));
});

app.get("/api/gl/:account", function (req, res) {
  knex.select()
    .from('GLActualsFact')
    .where({ secaccount: req.params.account })
    .then((response) => {
      //	console.log(response)
      res.json(response)
    })
});

app.get("/api/gl/v2/contracts", function (req, res) {
  var query = knex.select(
    'PurContractDistFact.ContractKey',
    'PurContractDistFact.secaccount',
    'PurContractDistFact.SCContractNum',
    'PurContractDistFact.SCCreateDate',
    'PurContractDistFact.SCSubmitDate',
    'PurContractDistFact.SCSubmitTime'
  )
    .from('PurContractDistFact')
    .where('SCCreateDate', '>=', req.query.date)
    .orderBy('SCCreateDate', 'desc')
    .then((response) => {
      res.json(response)
    })
    .catch(err => {
      console.log(err.stack)
    })
});

app.get("/api/gl/v2/:account", function (req, res) {
  console.log('in new gl')
  knex.select(
    'JEDate as EntryDate',
    'JENo as journalNumber',
    'GLActuals as glActuals',
    'JEDescr as description',
    'JERefDate as journalReferenceDate',
    'JESysNo as JESysNo',
    'JEREF1',
    'JEREF2',
    'JEREF3',
    'JEREF4',
    'JEAuditUserid as auditUser',
    'ORG as organization',
    'FiscYear as fiscalYear',
    'FiscPeriod as fiscalPeriod',
    'CalYear as calendarYear'

  )
    .from('GLActualsFact')
    .where({ secaccount: req.params.account })
    .leftJoin('Fiscperdim', 'GLActualsFact.FiscPerKey', 'Fiscperdim.FiscPerKey')
    .then((response) => {
      console.log('In response!')
      console.log(response)
      res.json(response)
    })

});



app.get("/api/gl/v2/contract/:contractNumber", function (req, res) {
  var query = knex.select(
    'PurContractDistFact.ContractKey',
    'PurContractDistFact.secaccount',
    'VendorDim.VendorID',
    'VendorDim.VendName',
    'PurContractDistFact.SCContractType',
    'PurContractDistFact.SCContractNum',
    'PurContractDistFact.SCRegDescr',
    'PurContractDistFact.SCContractState',
    'PurContractDistFact.SCAcqMethod',
    'PurContractDistFact.SCContMgr',
    'PurContractDistFact.SCContMgrPhon',
    'PurContractDistFact.SCVendContact',
    'PurContractDistFact.SCVendName',
    'PurContractDistFact.SCVendAddr',
    'PurContractDistFact.SCSubmitDate',
    'PurContractDistFact.SCSubmitTime',
    'PurContractDistFact.SCCommenceDate',
    'PurContractDistFact.SCExpiryDate',
    'PurContractDistFact.SCRevType',
    'PurContractDistFact.SCRevDescr',
    'PurContractDistFact.SCCreateDate',
    'PurContractDistFact.SCFiscYearMP',
    'PurContractDistFact.SCCurrentVal',
    'PurContractDistFact.SCDeltaVal',
    'PurContractDistFact.SCOrganisation'
  )
    .from('PurContractDistFact')
    .where({ SCContractNum: req.params.contractNumber })
    .leftJoin('VendorDim', 'PurContractDistFact.VendorKey', 'VendorDim.VendorKey')
    .then((response) => {
      //	console.log(response)
      res.json(response)
    })

});

app.get("/api/gl/:account/:contractNumber", function (req, res) {
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
    .where({ secaccount: req.params.account })
    .where({ JERef1: req.params.contractNumber })
    .then((response) => {
      //	console.log(response)
      res.json(response)
    })
});

app.get("/cs/accounts/:accountNumber", function (req, res) {
  //	res.send(contractQuery(req.params.contractNumber))
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
    .where({ account: req.params.accountNumber })
    .whereNot({ dept: 4 })
    .then((response) => {
      //	console.log(response)
      res.json(JSON.stringify(response, null, 2))
    })
  //executeQuery (res, contractQuery(req.params.contractNumber));
});

app.get("/cs/accounts", function (req, res) {
  //	res.send(contractQuery(req.params.contractNumber))
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
    .whereNot({ dept: '4' })
    .then((response) => {
      //	console.log(response)
      res.json(JSON.stringify(response, null, 2))
    })
  //executeQuery (res, contractQuery(req.params.contractNumber));
});

app.post("/vendor/search", function (req, res) {





  console.log('body: '+req.body.term)


  let { term } = req.body;
    if (!term)
      return res.status(400).send();
    term = term.trim();
    if (term.length == 0)
      return res.status(400).send();
    let results = knex("EDW-Finance-Stage.dbo.VendorDim")
      .whereRaw("ORG = 'YUKON' AND VendIsActive = '1' AND VendorId like 'CD%' AND (VendorId like '%?%' OR VendName like '%?%')", [term, term])
      .leftJoin("EDW-Finance-Stage.dbo.VendAddrDim", "VendorDim.VendorKey", "VendAddrDim.VendorKey")
      .select(["VendorDim.VendorId", "VendorDim.VendName", "VendorDim.VendShortName", "VendAddrDim.VendAddrCity", "VendorDim.VendIsPerson", "VendorDom.VendIsPayAllow",
        "VendAddrDim.VendAddrL1", "VendAddrDim.VendAddrL2", "VendAddrDim.VendAddrProv", "VendAddrDim.VendAddrPost"]).distinct();
    return res.json({ data: results, meta: { item_count: results.length } });
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
