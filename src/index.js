const e = require('express')
const express = require('express')
require('./db/mongoose') // starts up connection to database
const Task = require('./models/task') 
const User = require('./models/user')

const app = express()

const port = process.env.PORT || 3000

app.use(express.json()) // use this to parse any incoming json input to be used as a js object

app.post('/users', async (req,res) => { // CREATE NEW USER
    /*console.log(req.body)
    res.send('Testing')*/
    // console.log(req.body)
    const user = new User(req.body)
   
    try{
        await user.save() // everything that happens after this is once user is saved in db
        res.status(201).send(user)
    } catch(e){
        res.status(400).send(e)
    }
    // user.save().then(() =>{
    //     res.status(201).send(user) // can use 200 also but 201 specifies creation
    // }).catch((e) => {
    //     res.status(400) // res.status(400).send(e)
    //     res.send(e) // password too short or email invalid
    // })
})

app.post('/tasks', async (req,res) => { // CREATE NEW TASK
    const task = new Task(req.body)
    try{
        await task.save()
        res.status(201).send(task)
    } catch(e){
        res.status(400).send(e)
    }
    // task.save().then(()=>{ // save adds entry to mongodb 
    //     res.status(201).send(task)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})

app.get('/users', async (req,res) => { // FETCH ALL USERS
    try{
        const users = await User.find({})
        res.send(users)
    } catch(e){
        res.status(500).send()
    }
    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((e)=>[
    //     res.status(500).send() // 500 coz server error like not connecting to db. No need to send e as status 500 is self explanatory
    // ]) // {name:"Nilesh"} - can add filters like these
})

app.get('/users/:id', async (req,res) =>{ // FETCH PARTICULAR USER BASED ON ID ENTERED
    const id = req.params.id // no need to type cast it to mongodb id, mongoose does it automatically
    try{
        const user = await User.findById(id)
        if(!user){
            res.status(404).send()
        }
        else{
            res.send(user)
        }
    } catch(e){
        res.status(500).send()
    }
    // User.findById(id).then((user)=>{
    //     if(!user){ // user not found
    //         res.status(404).send()
    //     }
    //     else{
    //     res.send(user)
    //     }
    // }).catch((e)=>{ // request not sent
    //     res.status(500).send()
    // })
})

app.get('/tasks', async (req,res)=>{ // FETCH ALL TASKS
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    } catch(e){
        res.status(500).send()
    }
    // Task.find({}).then((tasks)=>{ // NO FILTER
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send() // 500 is internal server error
    // })
})

app.get('/tasks/:id', async (req,res)=>{ // FETCH SINGLE TASK BY ID
    const id = req.params.id
    try{
        const task = await Task.findById(id)
        if(!task){
            res.status(404).send()
        }
        else{
            res.send(task)
        }
    } catch(e){
        res.status(500).send()
    }
    // Task.findById(id).then((task)=>{
    //     if(!task){
    //         res.status(404).send()
    //     }
    //     else{
    //         res.send(task)
    //     }
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

app.patch('/users/:id', async (req,res)=>{ // UPDATE USER BY ID
    id = req.params.id

    const allowedUpdates = ['name', 'email', 'password', 'age'] // only these fields can be edited
    const updates = Object.keys(req.body) // properties passed in request
    const isValidOperation = updates.every((update) => { // every gives us each key one by one in updates
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error:'Invalid Update!'})
    }
    try{
        const user = await User.findByIdAndUpdate(id, req.body, { new :true, runValidators: true}) // new ensures the object returned is the updated user and runValidators ensures validation checks happen on the updated fields as well
        if(!user){
            res.status(404).send()
        }
        else{
            res.send(user)
        }
    } catch(e){
            res.status(400).send(e) // validation errors as invalid info entered
    }
})

app.patch('/tasks/:id', async (req,res) => {
    const id = req.params.id

    const allowedUpdates = ['completed', 'description']
    const updates = Object.keys(req.body) 
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error:"Invalid Update!"})
    }

    try{
        const task = await Task.findByIdAndUpdate(id,req.body,{new:true, runValidators:true})
        if(!task){
            res.status(404).send()
        }
        else{
            res.send(task)
        }
    } catch(e){
        res.status(400).send(e)
    }
})

app.delete("/users/:id", async (req,res) => {
    const id = req.params.id
    try{
       const user = await User.findByIdAndDelete(id)
       if(!user){
           res.status(404).send()
       }
       else{
           res.send(user)
       }
    } catch(e){
           res.status(500).send()
    }
})

app.delete('/tasks/:id', async (req,res) => {
    const id = req.params.id
    try{
        const task = await Task.findByIdAndDelete(id)
        if(!task){
            res.status(404).send()
        }
        else{
            res.send(task)
        }
    } catch(e){
        res.status(500).send()
    }
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})