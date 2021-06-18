const express = require('express')
const { body, validationResult } = require('express-validator')
const moment = require('moment')
const knex = require('../data')

const mjRouter = express.Router()
module.exports = mjRouter

mjRouter.post("/vendor/search", async (req, res) => {
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