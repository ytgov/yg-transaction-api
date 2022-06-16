const express = require('express')
const knex = require('../data')

const accountsRouter = express.Router()
module.exports = accountsRouter

accountsRouter.post("/departments", async (req, res) => {
  let results = await knex("EDW-Finance-Stage.dbo.GLAcctTree")
    .select(["account as dept", "descr"])
    .where({ org: "YUKON", level: 1 })
    .distinct().orderBy("account");

  return res.json({ data: results });
});
