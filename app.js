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
var oldRouter = require('./routes/gl')

app.use("/api/v1/gl", glRoutesV1)
app.use("/api/v2/gl", glRoutesV2)
app.use("/", oldRouter)

app.use(express.static('public'))

app.use("/", (req, res) => { res.status(404).send("Not found") })

app.listen(port, host, () => console.log(`Contract API listening on host ${host} at port ${port}!`))
