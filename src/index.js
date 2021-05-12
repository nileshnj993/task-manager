const express = require('express')
require('./db/mongoose') // starts up connection to database
const Task = require('./models/task') 
const User = require('./models/user')

const app = express()

const port = process.env.PORT || 3000

app.use(express.json()) // use this to parse any incoming json input to be used as a js object

app.post('/users', (req,res) => { // CREATE NEW USER
    /*console.log(req.body)
    res.send('Testing')*/
    console.log(req.body)
    const user = new User(req.body)
 
    user.save().then(() =>{
        res.send(user)
    }).catch((e) => {
        res.status(400) // res.status(400).send(e)
        res.send(e) // password too short or email invalid
    })
})

app.post('/tasks', (req,res) => { // CREATE NEW TASK
    const task = new Task(req.body)
    task.save().then(()=>{
        res.send(task)
    }).catch((e)=>{
        res.status(400).send(e)
    })
})










app.listen(port, () => {
    console.log('Server is up on port ' + port)
})