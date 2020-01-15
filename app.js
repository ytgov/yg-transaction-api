var express = require('express')
var jwks = require('jwks-rsa');
var sql = require("mssql");
 
var environment = process.env.NODE_ENV || 'staging'
var config = require('./knexfile.js')[environment]
const knex = require('knex')(config);

const app = express()
const port = 3001
const host = '0.0.0.0';

//Initiallising connection string

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'))

app.get('/', function(req, res) {
  res.send("Hey!");
});

// app.get('/contract', function(req, res) {
//   knex.select('*')
//     .from('dbo.purcontractdistfact')
//     .then(sql_res => res.send(sql_res))
//     .catch(e => res.status(404).send('Not found'))
// });

app.get("/api/contract/:contractNumber", function(req , res){
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
    .from('dbo.purcontractdistfact')
    .where({sccontractnum:req.params.contractNum})
    .then(sql_res => res.send(sql_res))
    .catch(e => res.status(404).send('Not found'))
});

app.get("/api/gl/:account", function(req , res){
  knex.select(
    "JERef1 as contractNumber",
    "GLActuals as invoiceAmount",
    "JEDate",
    "JEDescr as vendorId",
    "JERefDate",
    "JERef1 as contractNumber_JEREF1",
    "JERef2 as invoiceNUmber",
    "JEAuditUserid",
    "JEAuditDate",
    "secaccount as account",
    "FiscPeriod as fiscalPeriod")
    .from('dbo.GLActualsFact')
    .join('dbo.FiscperDim', 'dbo.GLActualsFact.FiscPerKey', 'dbo.FiscperDim.FiscPerKey')
    .where({secaccount: req.params.account})
    .then(sql_res => res.send(sql_res))
    .catch(e => res.status(404).send('Not found'))
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
    "secaccount as account",
    "FiscPeriod as fiscalPeriod")
    .from('dbo.GLActualsFact')
    .join('dbo.FiscperDim', 'dbo.GLActualsFact.FiscPerKey', 'dbo.FiscperDim.FiscPerKey')
    .where({secaccount: req.params.account})
    .where({JERef1: req.params.contractNumber })
    .then(sql_res => res.send(sql_res))
    .catch(e => res.status(404).send('Not found'))
});

app.get("/cs/accounts/:accountNumber", function(req , res){
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
    .then(sql_res => res.send(sql_res))
    .catch(e => res.status(404).send('Not found'))
});

app.get("/cs/accounts", function(req , res){
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
    .then(sql_res => res.send(sql_res))
    .catch(e => res.status(404).send('Not found'))
});

 app.get('/invoice/:arinvoice', function(req, res) {
   knex.select('*')
    .from('dbo.arobligfact as i')
    .leftJoin('dbo.arobligpayfact as p', 'i.arinvoice', 'p.arinvoice')
    .where({'i.arinvoice':req.params.arinvoice})
    .then(sql_res => res.send(sql_res))
    .catch(function(e){
        res.status(404).send('Not found');
        console.log(e);
    }) 
});

 app.get('/invoice', function(req, res) {
   knex.select('arinvoice')
    .from('dbo.arobligfact')
    .then(sql_res => res.send(sql_res))
    .catch(function(e){
        res.status(404).send('Not found');
    }) 
})

app.get('/customerSearch', function(req, res) {
let search =
  knex.select(
    'CustomerKey as customerKey',
    'CustomerId as customerID',
    'custName as customerName',
    'custShortName as custNameShort'
    )
    .from('dbo.customerDim')
    .where('custName', 'like', '%'+req.query.search+'%')
    .orWhere('custShortName', 'like', '%'+req.query.search+'%')
    .then(sql_res => res.send(sql_res))
    .catch(function(e){
        res.status(404).send('Not found');
        console.log(e);
    })
});

app.get('/vendorSearch', function(req, res) {
let search =
  knex.select(
    'VendorID as vendorID',
    'VendName as vendorName',
    'VendShortName as vendorNameShort'
    )
    .from('dbo.vendordim')
    .where('VendName', 'like', '%'+req.query.search+'%')
    .orWhere('VendShortName', 'like', '%'+req.query.search+'%')
    .then(sql_res => res.send(sql_res))
    .catch(function(e){
        res.status(404).send('Not found');
        console.log(e);
    })
});

app.get('/vendor/person', function(req, res) {
  var query = knex.select(
    'v.VendName as vendorName',
    'v.VendShortName as vendorNameShort',
    'v.Org as org',
    'v.VendTypeCode as vendorTypeCode',
    'v.VendIsPerson as vendorIsPerson',
    'v.VendTransCurrency as vendorTransCurrency',
    'v.SIN',
    'v.Vend3rdParty as vendorThirdParty',
    'v.VendIsPayAllow as vendorIsPayAllow',
    'v.VendBank as vendBank',
    'v.VendIsVoucherAllow as vendorIsVoucherAllow',
    'v.VendIsPurchaseAllow as vendorIsPurchaseAllow',
    'v.VendPayTypeCode as vendorPayTypeCode',
    'v.VendPayType as vendorPayType',
    'v.VendTerms as vendorTerms',
    'v.VendNotes as vendorNotes',
    'va.VendAddrL1 as vendorAddr1',
    'va.VendAddrL2 as vendorAddrL2',
    'va.VendAddrL3 as vendorAddrL3',
    'va.VendAddrL4 as vendorAddrL3',
    'va.VendAddrCity as vendorAddrCity',
    'va.VendAddrProv as vendorAddrProv',
    'va.VendAddrPost as vendorAddrPost',
    'va.VendAddrCountry as vendorAddrCountry',
    'va.VendAddrIsDefault as vendorAddrIsDefault'
    )
    .from('dbo.vendordim as v')
    .join('dbo.vendaddrdim as va', 'v.vendorkey', 'va.vendorkey')
    .where('VendIsPerson', '1')
    if(typeof req.query.first != 'undefined') query.andWhere('VendName', 'like', req.query.first+' %')
    if(typeof req.query.last != 'undefined') query.andWhere('VendName', 'like', '%'+req.query.last)
    if(typeof req.query.middle != 'undefined') query.andWhere('VendName', 'like', '% '+req.query.middle+' %')
    if(typeof req.query.postal != 'undefined') query.andWhere('VendAddrPost', 'like', '% '+req.query.postal)
    query.then(function(sql_res){
        if(sql_res.length == 1) res.send(sql_res);
	else res.sendStatus(403);
    })
    query.catch(function(e){
        res.status(404).send('Not found');
        console.log(e);
    })
});

app.get('/vendor/business', function(req, res) {
  var query = knex.select(
    'v.VendName as vendorName',
    'v.VendShortName as vendorNameShort',
    'v.Org as org',
    'v.VendTypeCode as vendorTypeCode',
    'v.VendIsPerson as vendorIsPerson',
    'v.VendTransCurrency as vendorTransCurrency',
    'v.SIN',
    'v.Vend3rdParty as vendorThirdParty',
    'v.VendIsPayAllow as vendorIsPayAllow',
    'v.VendBank as vendBank',
    'v.VendIsVoucherAllow as vendorIsVoucherAllow',
    'v.VendIsPurchaseAllow as vendorIsPurchaseAllow',
    'v.VendPayTypeCode as vendorPayTypeCode',
    'v.VendPayType as vendorPayType',
    'v.VendTerms as vendorTerms',
    'v.VendNotes as vendorNotes',
    'va.VendAddrL1 as vendorAddr1',
    'va.VendAddrL2 as vendorAddrL2',
    'va.VendAddrL3 as vendorAddrL3',
    'va.VendAddrL4 as vendorAddrL3',
    'va.VendAddrCity as vendorAddrCity',
    'va.VendAddrProv as vendorAddrProv',
    'va.VendAddrPost as vendorAddrPost',
    'va.VendAddrCountry as vendorAddrCountry',
    'va.VendAddrIsDefault as vendorAddrIsDefault'
    )
    .from('dbo.vendordim as v')
    .join('dbo.vendaddrdim as va', 'v.vendorkey', 'va.vendorkey')
    .where('VendName', 'like', '%'+req.query.name+'%')
    .orWhere('VendShortName', 'like', '%'+req.query.name+'%')
    query.then(sql_res => res.send(sql_res))
    query.catch(function(e){
        res.status(404).send('Not found');
        console.log(e);
    })
});

app.get('/vendor/:vendorID', function(req, res) {
  knex.select(
    'v.VendName as vendorName',
    'v.VendShortName as vendorNameShort',
    'v.Org as org',
    'v.VendTypeCode as vendorTypeCode',
    'v.VendIsPerson as vendorIsPerson',
    'v.VendTransCurrency as vendorTransCurrency',
    'v.SIN',
    'v.Vend3rdParty as vendorThirdParty',
    'v.VendIsPayAllow as vendorIsPayAllow',
    'v.VendBank as vendBank',
    'v.VendIsVoucherAllow as vendorIsVoucherAllow',
    'v.VendIsPurchaseAllow as vendorIsPurchaseAllow',
    'v.VendPayTypeCode as vendorPayTypeCode',
    'v.VendPayType as vendorPayType',
    'v.VendTerms as vendorTerms',
    'v.VendNotes as vendorNotes',
    'va.VendAddrL1 as vendorAddr1',
    'va.VendAddrL2 as vendorAddrL2',
    'va.VendAddrL3 as vendorAddrL3',
    'va.VendAddrL4 as vendorAddrL3',
    'va.VendAddrCity as vendorAddrCity',
    'va.VendAddrProv as vendorAddrProv',
    'va.VendAddrPost as vendorAddrPost',
    'va.VendAddrCountry as vendorAddrCountry',
    'va.VendAddrIsDefault as vendorAddrIsDefault'
    )
    .from('dbo.vendordim as v')
    .join('dbo.vendaddrdim as va', 'v.vendorkey', 'va.vendorkey')
    .where({'v.vendorID': req.params.vendorID})
    .then(sql_res => res.send(sql_res))
    .catch(function(e){
        res.status(404).send('Not found');
        console.log(e);
    })
});

app.get('/apInvoices/:vendorID', function(req, res) {
  knex.select('dbo.apdistfact.*')
    .from('dbo.vendordim')
    .join('dbo.apdistfact', 'dbo.vendordim.vendorkey', 'dbo.apdistfact.vendorkey')
    .where({vendorID : req.params.vendorID})
    .then(sql_res => res.send(sql_res))
    .catch(function(e){
        res.status(404).send('Not found');
        console.log(e);
    })
});

app.get('/arInvoices/:customerID', function(req, res) {
  knex.select('dbo.arobligfact.*', 'dbo.arobligpayfact.*')
    .from('dbo.customerdim')
    .join('dbo.arobligfact', 'dbo.customerdim.customerkey', 'dbo.arobligfact.customerkey')
    .join('dbo.arobligpayfact', 'dbo.arobligpayfact.arinvoice', 'dbo.arobligfact.arinvoice')
    .where({customerID : req.params.customerID})
    .then(sql_res => res.send(sql_res))
    .catch(function(e){
        res.status(404).send('Not found');
        console.log(e);
    })
});

/*
app.get('/invoice', function(req, res) {
  knex.select('*')
    .from('dbo.arobligfact')
    .then(sql_res => res.send(sql_res))
    .catch(e => res.status(404).send('Not found'))
});

app.get('/vendor', function(req, res) {
  knex.select('*')
    .from('dbo.vendordim')
    .join('dbo.vendaddrdim', 'dbo.vendaddrdim.vendorkey', 'dbo.vendordim.vendorkey')
    .then(sql_res => res.send(sql_res))
    .catch(e => res.status(404).send('Not found'))
});
*/

app.get('/services/fiscalKeyToPeriod/:fiscalKey', function(req , res) {
  knex.select('fiscperiod as fiscalPeriod')
    .from('dbo.fiscperdim')
    .where({fiscperkey:req.params.fiscalKey})
    .then(sql_res => res.send(sql_res))
    .catch(function(e){
    	res.status(404).send('Not found');
    	console.log(e);
    })
});

app.get('/services/fiscalDateToPeriod/', function(req , res) {
  knex.select('fiscperiod as fiscalPeriod')
    .from('dbo.fiscperdim')
    .where('PerStartDt', '<=', req.query.date)
    .where('PerEndDt', '>=', req.query.date)
    .first()
    .then(sql_res => res.send(sql_res))
    .catch(function(e){
      res.status(404).send('Not found');
      console.log(e);
    })
});

// app.get('services/departmentSearch/:search', function(req , res) {
//   knex.select('depID', 'dep')
//     .from('dbo.fdep?')
//     .where({depID:req.query.search})
//     .then(sql_res => res.send(sql_res))
//     .catch(e => res.status(404).send('Not found'))
// });
//
// app.get('services/departmentSearch/:search', function(req , res) {
//   knex.select('depID', 'dep')
//     .from('dbo.fiscperdim')
//     .where({"dep", "ilike", req.query.search})
//     .then(sql_res => res.send(sql_res))
//     .catch(e => res.status(404).send('Not found'))
// });

/* NOT IMPLEMENTED
//peron
app.get('/person/:ynetID', function(req, res) {
  //res.send(req.params.ynetID);
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
*/

app.listen(port, host, () => console.log(`Contract API listening on host ${host} at port ${port}!`))
