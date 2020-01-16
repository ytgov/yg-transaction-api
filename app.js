var express = require('express')
var jwks = require('jwks-rsa');
var sql = require("mssql");

var environment = process.env.NODE_ENV || 'staging';
var config = require('./knexfile.js')[environment];
const knex = require('knex')(config);

const app = express();
const port = 3001;
const host = '0.0.0.0';

//Initiallising connection string

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'))

var vendors = require('./vendors');
var services = require('./services');
var generalLedgers = require('./generalLedger');

app.get('/', function(req, res) {
  res.send("Hey!");
});

app.get('/vendorSearch', vendors.vendorSearchByName);
app.get('/vendor/person', vendors.personSearch);
app.get('/vendor/business', vendors.businessSearch);
app.get('/vendor/:vendorID', vendors.vendorSearchByVendorID);
app.get('/apInvoices/:vendorID', vendors.invoiceSearchByBusinessID);
app.get('/arInvoices/:customerID', vendors.customerSearchByCustomerId);

app.get("/gl/:account", generalLedgers.GLAccountSeach);
app.get("/gl/:account/:contractNumber", generalLedgers.GLContractSearch);
app.get("/cs/accounts/:accountNumber", generalLedgers.CSAccountSearch);
app.get("/cs/accounts", generalLedgers.CSAccounts);

app.get('/services/fiscalKeyToPeriod/:fiscalKey', services.fiscalKeyToFiscalPeriod);
app.get('/services/fiscalDateToPeriod/', services.dateToFiscalPeriod);

app.get("/contract/:contractNumber", function(req , res){
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

app.listen(port, host, () => console.log(`Contract API listening on host ${host} at port ${port}!`))
