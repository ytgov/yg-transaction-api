const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3034
const host = '0.0.0.0';

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const glV1Router = require('./routes/gl-v1')
const glV2Router = require('./routes/gl-v2')
const contractRouter = require('./routes/contracts')
const oldRouter = require('./routes/gl')
const csRouter = require('./routes/cs')
const mjRouter = require('./routes/mj');
const accountsRouter = require('./routes/accounts.router');

app.use("/api/v1/gl", glV1Router)
app.use("/api/v1/cs", csRouter)
app.use("/api/v1/contracts", contractRouter)
app.use("/api/v1/", mjRouter)

app.use("/api/v2/gl", glV2Router)
app.use("/api/v2/cs", csRouter)
app.use("/api/v2/contracts", contractRouter)
app.use("/api/v2/accounts", accountsRouter)
app.use("/api/v2/", mjRouter)

app.use("/", oldRouter)

app.use(express.static('public'))

app.use("/", (req, res) => { res.status(404).send("Not found") })

app.listen(port, host, () => console.log(`Contract API listening on host ${host} at port ${port}!`))
