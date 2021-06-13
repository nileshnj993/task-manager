const express = require('express')
require('./db/mongoose') // starts up connection to database

const app = express()

app.use(express.json()) // use this to parse any incoming json input to be used as a js object

const userRouter = require('./routers/user')
app.use(userRouter)

const taskRouter = require('./routers/task')
app.use(taskRouter)

module.exports = app

// this code is used for testing purposes as we don't need to do app.listen in order to run test cases

