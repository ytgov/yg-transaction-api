const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 3034
const host = '0.0.0.0';

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

var glRoutesV1 = require('./routes/gl-v1')
var glRoutesV2 = require('./routes/gl-v2')
var contracs = require('./routes/contracts')
var oldRouter = require('./routes/gl')
var csRouter = require('./routes/cs')
var mjRouter = require('./routes/mj');
const contractRouter = require('./routes/contracts');

app.use("/api/v1/gl", glRoutesV1)
app.use("/api/v1/cs", csRouter)
app.use("/api/v1/contracts", contractRouter)
app.use("/api/v1/", mjRouter)

app.use("/api/v2/gl", glRoutesV1)
app.use("/api/v2/cs", csRouter)
app.use("/api/v2/contracts", contractRouter)
app.use("/api/v2/", mjRouter)

app.use("/", oldRouter)

app.use(express.static('public'))

app.use("/", (req, res) => { res.status(404).send("Not found") })

app.listen(port, host, () => console.log(`Contract API listening on host ${host} at port ${port}!`))
