const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const taskSchema = new mongoose.Schema({
        description:{
            type:String,
            required:true,
            trim:true
        },
        completed:{
            type:Boolean,
            default:false, // makes it compulsory to enter this value
        }, 
        owner: { // the user that created the task
            type: mongoose.Schema.Types.ObjectId, // user id
            required:true,
            ref: 'User' // same name as mentioned in other model which we want to connect with
        }
})

taskSchema.pre('save', async function(next){
    const task = this

    next()
})

const Tasks = mongoose.model('Tasks', taskSchema)

module.exports = Tasks