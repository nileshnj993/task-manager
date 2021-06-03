const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req,res) => { // CREATE NEW TASK
    // we need to authenticate creation of task using the person that created it
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body, // copies all the attributes of body with one line
        owner: req.user._id
    })
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

// GET /tasks?completed=true - url structure for fetching only complete/incomplete tasks
// GET /tasks?limit=10&skip=0 limit and skip used to implement pagination (limit specifies number of results on one page. skip specifies how many results to be skipped before showing current results ie. for page 2, limit =10 and skip = 10)
// GET /tasks?sortBy=createdAt:asc used for sorting results based on a given field and ascending/descending order
router.get('/tasks', auth, async (req,res)=>{ // FETCH ALL TASKS
    try{
        const match = { // filtering variable
            owner:req.user._id
        }
        const sort = {}
        if(req.query.completed){ // if the query is provided ie. some additional route
            match.completed = req.query.completed === 'true' // true or false added to match object for filtering
        }
        if(req.query.sortBy){ // check if provided
            const parts = req.query.sortBy.split(':') // split into field to sort by and ascending/descending choice
            if(parts[1]==='desc'){
                sort[parts[0]] = -1 // sort['createdAt'] = -1
            }
            else{
                sort[parts[0]] = 1
            }
        }
        const limitations = {
            skip:parseInt(req.query.skip),
            limit:parseInt(req.query.limit),
            sort
            
        }
        const tasks = await Task.find(match, null, limitations) // filter, projections(set to null), options
        // await req.user.populate('tasks).execPopulate()
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

router.get('/tasks/:id', auth, async (req,res)=>{ // FETCH SINGLE TASK BY ID that I have created. Also have to be logged in
    const id = req.params.id
    try{
        const task = await Task.findOne({_id:id, owner:req.user._id}) // task id and owner id used
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


router.patch('/tasks/:id', auth, async (req,res) => {
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
        const task = await Task.findOne({_id:id, owner:req.user._id})
        
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
    } catch(e){
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req,res) => {
    const id = req.params.id
    try{
        const task = await Task.findOneAndDelete({_id:id, owner:req.user._id})
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