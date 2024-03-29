const express = require('express')
const { body, validationResult, param } = require('express-validator')
const moment = require('moment')
const knex = require('../data')

const mjRouter = express.Router()
module.exports = mjRouter

mjRouter.post("/vendor/search", [body("term").notEmpty().toUpperCase().trim()], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let { term } = req.body;

  if (!term)
    return res.status(400).send("The body parameter 'term' is required.");

  if (term.length == 0)
    return res.status(400).send("The body parameter 'term' is required.");


  let results = await knex("softstar.VendorDim")
    .whereRaw(`VendorDim.ORG = 'YUKON' AND VendorDim.VendIsActive = '1' AND VendorDim.VendorId like 'CD%' AND (VendorDim.VendorId like ? OR VendorDim.VendName like ? OR VendAddrDim.VendAddrL1 like ?) AND VendAddrDim.VendAddrIsDefault = 1`, [`%${term}%`, `%${term}%`, `%${term}%`])
    .leftJoin("softstar.VendAddrDim", "VendorDim.VendorKey", "VendAddrDim.VendorKey")
    .select(["VendorDim.VendorId", "VendorDim.VendName", "VendorDim.VendShortName", "VendAddrDim.VendAddrCity", "VendorDim.VendIsPerson", "VendorDim.VendIsPayAllow",
      "VendAddrDim.VendAddrL1", "VendAddrDim.VendAddrL2", "VendAddrDim.VendAddrProv", "VendAddrDim.VendAddrPost", "VendorDim.VendPayTypeCode"]).distinct().orderBy("VendorDim.VendorId");

  return res.json({ data: results, meta: { item_count: results.length } });
});

mjRouter.get("/vendor/:id", [param("id").notEmpty().toUpperCase().trim()], async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let { id } = req.params;

  let results = await knex("softstar.VendorDim")
    .whereRaw(`VendorDim.ORG = 'YUKON' AND VendorDim.VendIsActive = '1' AND VendorDim.VendorId like 'CD%' AND VendorDim.VendorId like ? AND VendAddrDim.VendAddrIsDefault = 1`, [id])
    .leftJoin("softstar.VendAddrDim", "VendorDim.VendorKey", "VendAddrDim.VendorKey")
    .select(["VendorDim.VendorId", "VendorDim.VendName", "VendorDim.VendShortName", "VendAddrDim.VendAddrCity", "VendorDim.VendIsPerson", "VendorDim.VendIsPayAllow",
      "VendAddrDim.VendAddrL1", "VendAddrDim.VendAddrL2", "VendAddrDim.VendAddrProv", "VendAddrDim.VendAddrPost", "VendorDim.VendPayTypeCode"]).distinct().orderBy("VendorDim.VendorId");

  return res.json({ data: results, meta: { item_count: results.length } });
});

mjRouter.post("/transactions/search", [
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
  let query = `SELECT TransFact.secaccount as account, TransFactKey as tranaction_key, FiscYear as fisc_year, FiscPeriod as fisc_period, 
        VendorID as vendorid, EffDate as eff_date, ExpAmt as amount, TransDescr as trans_desc, Source as source, APDescr as ap_desc,
        TransFact.APInvoiceNo as invoice_num, TransFact.APInvoiceDate as invoice_date, TransFact.APBatchNo as batch_num, TransFact.IsDistributed as is_distributed, APRef4 as ap_ref4
        FROM softstar.[TransFact] INNER JOIN softstar.VendorDim on TransFact.VEndorKey = VendorDim.VendorKey
        INNER JOIN softstar.FiscperDim ON (TransFact.FiscPerKey = FiscperDim.FiscPerKey)
        INNER JOIN softstar.APDistFactAll ON (TransFact.APDistKey = APDistFactAll.APDistKey) WHERE TransFact.APDistKey IS NOT NULL AND TransFact.SECACCOUNT = ?`;

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