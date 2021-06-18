const express = require('express')
const { body, validationResult } = require('express-validator')
const knex = require("../data")

const glV2Router = express.Router()
module.exports = glV2Router

glV2Router.get("/contracts", function (req, res) {
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

glV2Router.get("/:account", function (req, res) {
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