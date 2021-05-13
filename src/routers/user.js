const express = require('express')
const router = new express.Router()
const User = require('../models/user')

router.get('/test', (req,res)=>{
    res.send('From a new file')
})

router.post('/users', async (req,res) => { // CREATE NEW USER
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

router.get('/users', async (req,res) => { // FETCH ALL USERS
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

router.get('/users/:id', async (req,res) =>{ // FETCH PARTICULAR USER BASED ON ID ENTERED
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

router.patch('/users/:id', async (req,res)=>{ // UPDATE USER BY ID
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

router.delete("/users/:id", async (req,res) => {
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


module.exports = router