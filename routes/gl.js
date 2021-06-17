const sql = require("mssql")
const moment = require('moment')
const { body, validationResult } = require('express-validator')

const { dbHost } = require('../config/config')
const { dbUser } = require('../config/config')
const { dbPassword } = require('../config/config')
const { db } = require('../config/config')

const knex = require('knex')({
  client: 'mssql',
  connection: {
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: db
  }
})

module.exports = function(app){

  app.get("/status", function (req, res) {
   res.send("Finance API is up")
  });

  app.get("/api/contract/:contractNumber", function (req, res) {
    knex.select(
        'scdeptname as department', 'SCRevType as revisionType', 'SCRevDescr as revisionDescription', 'SCAuthName as authorizedBy',
        'SCAuthPosn as authorizedPosition', 'SCCurrentVal as currentValue', 'SCDeltaVal as deltaValue', 'secaccount as account',
        'SCCommenceDate as contractStartDate', 'SCContractNum as contractNumber', 'SCExpiryDate as contractEndDate',
        'SCContMgr as contractManager', 'SCAcqMethod as acquisitionMethod', 'SCValuePrice as acquisitionEvaluation',
        'SCContractState as contractState'
      )
      .from('PurContractDistFact')
      .where({ SCContractNum: req.params.contractNumber })
      .then((response) => {
        res.json(response)
      })
  });

  app.get("/api/gl/:account", function (req, res) {
    knex.select()
      .from('GLActualsFact')
      .where({ secaccount: req.params.account })
      .then((response) => {
        res.json(response)
      })
  });

  app.get("/api/gl/v2/contracts", function (req, res) {
    var query = knex.select(
        'PurContractDistFact.ContractKey', 'PurContractDistFact.secaccount', 'PurContractDistFact.SCContractNum',
        'PurContractDistFact.SCCreateDate', 'PurContractDistFact.SCSubmitDate', 'PurContractDistFact.SCSubmitTime'
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
        'JEDate as EntryDate', 'JENo as journalNumber', 'GLActuals as glActuals', 'JEDescr as description',
        'JERefDate as journalReferenceDate', 'JESysNo as JESysNo', 'JEREF1', 'JEREF2', 'JEREF3', 'JEREF4', 'JEAuditUserid as auditUser',
        'ORG as organization', 'FiscYear as fiscalYear', 'FiscPeriod as fiscalPeriod', 'CalYear as calendarYear'
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
        'PurContractDistFact.ContractKey', 'PurContractDistFact.secaccount', 'VendorDim.VendorID', 'VendorDim.VendName',
        'PurContractDistFact.SCContractType', 'PurContractDistFact.SCContractNum', 'PurContractDistFact.SCRegDescr',
        'PurContractDistFact.SCContractState', 'PurContractDistFact.SCAcqMethod', 'PurContractDistFact.SCContMgr',
        'PurContractDistFact.SCContMgrPhon', 'PurContractDistFact.SCVendContact', 'PurContractDistFact.SCVendName',
        'PurContractDistFact.SCVendAddr', 'PurContractDistFact.SCSubmitDate', 'PurContractDistFact.SCSubmitTime',
        'PurContractDistFact.SCCommenceDate', 'PurContractDistFact.SCExpiryDate', 'PurContractDistFact.SCRevType',
        'PurContractDistFact.SCRevDescr', 'PurContractDistFact.SCCreateDate', 'PurContractDistFact.SCFiscYearMP',
        'PurContractDistFact.SCCurrentVal', 'PurContractDistFact.SCDeltaVal', 'PurContractDistFact.SCOrganisation'
      )
      .from('PurContractDistFact')
      .where({ SCContractNum: req.params.contractNumber })
      .leftJoin('VendorDim', 'PurContractDistFact.VendorKey', 'VendorDim.VendorKey')
      .then((response) => {
        res.json(response)
      })
  });

  app.get("/api/gl/:account/:contractNumber", function (req, res) {
    knex.select(
        'GLActuals as invoiceAmount', 'JEDate', 'JEDescr as vendorId', 'JERefDate', 'JERef1 as contractNumber_JEREF1',
        'JERef2 as invoiceNUmber', 'JEAuditUserid', 'JEAuditDate', 'secaccount as account'
      )
      .from('EDW-Finance-Stage.dbo.GLActualsFact')
      .where({ secaccount: req.params.account })
      .where({ JERef1: req.params.contractNumber })
      .then((response) => {
        res.json(response)
      })
  });

  app.get("/cs/accounts/:accountNumber", function (req, res) {
    knex.select(
        'Account as account', 'deptDescr as department', 'AcctDescr as accountDescription', 'TypeDescr as type',
        'ActiveDescr as status', 'ObjectDescr as objectDescription', 'A2VoteDescr as voteDescription', 
        'A2ProgDescr as programDescription', 'A2ActivityDescr as activityDescription', 'A2ElementDescr as elementDescription'
      )
      .from('GLAcctDim')
      .where({ account: req.params.accountNumber })
      .whereNot({ dept: 4 })
      .then((response) => {
        res.json(JSON.stringify(response, null, 2))
      })
  });

  app.get("/cs/accounts", function (req, res) {
    knex.select(
        'Account as account', 'deptDescr as department', 'AcctDescr as accountDescription', 'TypeDescr as type', 
        'ActiveDescr as status', 'ObjectDescr as objectDescription', 'A2VoteDescr as voteDescription',
        'A2ProgDescr as programDescription', 'A2ActivityDescr as activityDescription', 'A2ElementDescr as elementDescription'
      )
      .from('EDW-Finance-Stage.dbo.GLAcctDim')
      .whereNot({ dept: '4' })
      .then((response) => {
        res.json(JSON.stringify(response, null, 2))
      })
  });

  app.post("/vendor/search", async (req, res) => {
    let { term } = req.body;

    if (!term)
      return res.status(400).send("The body parameter 'term' is required.");

    term = term.trim().toUpperCase();

    if (term.length == 0)
      return res.status(400).send("The body parameter 'term' is required.");

    let results = await knex("EDW-Finance-Stage.dbo.VendorDim")
      .whereRaw(`VendorDim.ORG = 'YUKON' AND VendorDim.VendIsActive = '1' AND VendorDim.VendorId like 'CD%' AND (VendorDim.VendorId like ? OR VendorDim.VendName like ?) AND VendAddrDim.VendAddrIsDefault = 1`, [`%${term}%`, `%${term}%`])
      .leftJoin("EDW-Finance-Stage.dbo.VendAddrDim", "VendorDim.VendorKey", "VendAddrDim.VendorKey")
      .select(["VendorDim.VendorId", "VendorDim.VendName", "VendorDim.VendShortName", "VendAddrDim.VendAddrCity", "VendorDim.VendIsPerson", "VendorDim.VendIsPayAllow",
        "VendAddrDim.VendAddrL1", "VendAddrDim.VendAddrL2", "VendAddrDim.VendAddrProv", "VendAddrDim.VendAddrPost"]).distinct().orderBy("VendorDim.VendorId");

    return res.json({ data: results, meta: { item_count: results.length } });
  });

  app.post("/transactions/search", [
    body("account").notEmpty().bail().isString().toUpperCase(),
    body("vendorid").toUpperCase(),
    body("fisc_year").toUpperCase()
  ], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let { account, vendorid, fisc_year } = req.body;

    let params = [account];
    let query = `SELECT secaccount as account, TransFactKey as tranaction_key, FiscYear as fisc_year, FiscPeriod as fisc_period, 
      VendorID as vendorid, EffDate as eff_date, ExpAmt as amount, TransDescr as trans_desc, Source as source, APDescr as ap_desc,
      APInvoiceNo as invoice_num, APInvoiceDate as invoice_date, APBatchNo as batch_num, IsDistributed as is_distributed 
      FROM [EDW-Finance-Stage].[dbo].[TransFact] INNER JOIN VendorDim on TransFact.VEndorKey = VendorDim.VendorKey
      INNER JOIN FiscperDim ON (TransFact.FiscPerKey = FiscperDim.FiscPerKey) WHERE APDistKey IS NOT NULL AND SECACCOUNT = ?`;

    if (vendorid) {
      query += ` AND VendorId = ?`;
      params.push(vendorid);
    }

    if (fisc_year) {
      query += ` AND FiscYear = ?`;
      params.push(fisc_year);
    }

    //'0710707250301000121613'
    let results = await knex.raw(query, params);

    // this is step cleans the date for display and converts the timeless database entry (which UTC is implied) to local time
    results.map(r => r.invoice_date = moment(r.invoice_date).add(7, 'hours').format("YYYY-MM-DD"));
    results.map(r => r.eff_date = moment(r.eff_date).add(7, 'hours').format("YYYY-MM-DD"));

    return res.json({ data: results, meta: { item_count: results.length } });
  })
} 