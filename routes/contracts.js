const express = require('express')
const { body, validationResult } = require('express-validator')
const knex = require('../data')

const contractRouter = express.Router()
module.exports = contractRouter

contractRouter.get("/:contractNumber", function (req, res) {
    knex.select(
        'scdeptname as department', 'SCRevType as revisionType', 'SCRevDescr as revisionDescription', 'SCAuthName as authorizedBy',
        'SCAuthPosn as authorizedPosition', 'SCCurrentVal as currentValue', 'SCDeltaVal as deltaValue', 'secaccount as account',
        'SCCommenceDate as contractStartDate', 'SCContractNum as contractNumber', 'SCExpiryDate as contractEndDate',
        'SCContMgr as contractManager', 'SCAcqMethod as acquisitionMethod', 'SCValuePrice as acquisitionEvaluation',
        'SCContractState as contractState'
    )
        .from('softstar.PurContractDistFact')
        .where({ SCContractNum: req.params.contractNumber })
        .then((response) => {
            res.json(response)
        })
});