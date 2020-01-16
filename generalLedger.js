var environment = process.env.NODE_ENV || 'staging';
var config = require('./knexfile.js')[environment];
const knex = require('knex')(config);

exports.GLAccountSeach = function(req , res){
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
}

exports.GLContractSearch = function(req , res){
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
}

exports.CSAccountSearch = function(req , res){
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
}

exports.CSAccounts = function(req , res){
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
}
