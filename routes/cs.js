const express = require('express')
const { body, validationResult } = require('express-validator')
const knex = require('../data')

const csRouter = express.Router()
module.exports = csRouter

csRouter.get("/accounts/:accountNumber", function (req, res) {
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
})

csRouter.get("/accounts", function (req, res) {
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
})
