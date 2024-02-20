const express = require('express')
const { body, validationResult } = require('express-validator')
const knex = require("../data")

const glV1Router = express.Router()
module.exports = glV1Router

glV1Router.get("/:account", function (req, res) {
  knex.select()
    .from('softstar.GLActualsFact')
    .where({ secaccount: req.params.account })
    .then((response) => {
      res.json(response)
    })
});

glV1Router.get("/:account/:contractNumber", function (req, res) {
  knex.select(
    'GLActuals as invoiceAmount', 'JEDate', 'JEDescr as vendorId', 'JERefDate', 'JERef1 as contractNumber_JEREF1',
    'JERef2 as invoiceNUmber', 'JEAuditUserid', 'JEAuditDate', 'secaccount as account'
  )
    .from('softstar.GLActualsFact')
    .where({ secaccount: req.params.account })
    .where({ JERef1: req.params.contractNumber })
    .then((response) => {
      res.json(response)
    })
});