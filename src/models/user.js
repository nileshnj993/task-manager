// This file is to store structure of user class

const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    name:{
        type:String,
        required:true,
        default:'Anonymous', // in case user doesn't enter value,
        trim: true // removes all spaces at start and end of name
    },
    age:{
        type:Number,
        default:0,
        validate(value){ // custom validation
            if(value < 0){
                throw new Error('Age must be a positive number')
            }
        },
    },
    email:{
        type:String,
        require:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        },
        trim:true,
        lowercase:true
    },
    password:{ // plain text for now
        type:String,
        required:true,
        trim:true,
 // no need of validate part if doing this
        validate(value){
            if(value.length < 7){ // we can use minlength:7 also
                throw new Error('Password must be at least 7 characters long!')
            }
            if(value.toLowerCase().includes('password')){ // could've used lowercase:true instead too
                throw new Error('Password must not include the word password')
            }
        }
    }
})



module.exports = User