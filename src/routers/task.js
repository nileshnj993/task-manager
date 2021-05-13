const express = require('express')
const router = new express.Router()
const Task = require('../models/task')

router.post('/tasks', async (req,res) => { // CREATE NEW TASK
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





router.get('/tasks', async (req,res)=>{ // FETCH ALL TASKS
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

router.get('/tasks/:id', async (req,res)=>{ // FETCH SINGLE TASK BY ID
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


router.patch('/tasks/:id', async (req,res) => {
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



router.delete('/tasks/:id', async (req,res) => {
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

module.exports = router