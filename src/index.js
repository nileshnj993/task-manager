const e = require('express')
const express = require('express')
require('./db/mongoose') // starts up connection to database
const Task = require('./models/task') 

const app = express()

const port = process.env.PORT || 3000

app.use(express.json()) // use this to parse any incoming json input to be used as a js object

const userRouter = require('./routers/user')
app.use(userRouter)
// const router = new express.Router() // for multiple routes, create a new router
// // router has all http request methods like post. get, patch, delete

// router.get('/test', (req,res) => { // set up route
//     res.send('This is from my other router')
// })
// app.use(router) // register the router

const taskRouter = require('./routers/task')
app.use(taskRouter)



app.listen(port, () => {
    console.log('Server is up on port ' + port)
})