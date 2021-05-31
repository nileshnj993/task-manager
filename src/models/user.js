// This file is to store structure of user class
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({ // validation and sanitization of attributes
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
        lowercase:true,
        unique:true // only unique emails allowed
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
    },
    tokens:[{
        token: {
            type:String,
            required:true
        }
    }]
})

// methods can be accessed on instances of User model (schema)
userSchema.methods.generateAuthToken = async function () { // need to use 'this' so no arrow function
    const user = this
    const token = jwt.sign({_id:user._id.toString()}, "thisisatest")
    user.tokens = user.tokens.concat({token:token})
    await user.save() // generating tokens and saving to db
    return token
}

userSchema.virtual('tasks', {
    ref:"Tasks", // not a column in the db, just a virtual connection for mongoose
    localField:"_id", // name of field in user db
    foreignField:"owner" // name of field in task db
})

userSchema.methods.toJSON= function () {// toJSON determines what gets returned when a json object is stringified ie. whenever res.send is used
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.statics.findByCredentials = async (email, password) => { // adding reusable function as part of the schema for login purposes
    const user = await User.findOne({email}) // email == this.email
    if(!user){
        throw new Error('Unable to login!')
    }
    
    const isMatch = await bcrypt.compare(password, user.password) // compare entered password with the password matching with the email that has been verified
    console.log(isMatch)
    if(!isMatch){
        throw new Error('Unable to login!')
    }
    return user
}


// hash password before saving
userSchema.pre('save', async function(next){ // pre indicates operation to be done just before new user is created / saved, do this
    // next is the function that executes after saving. We can't use arrow notation as we need to use 'this'
    const user = this // particular user document being saved
    if(user.isModified('password')){ // ismodified takes care of update to password as well as setting new password
        user.password = await bcrypt.hash(user.password,8)
        // console.log('Password has been hashed successfully!')
    }
    next() // without this call no user will be saved coz system will think we are going to add more pre instructions
})

// delete tasks when user who created them is deleted
userSchema.pre('remove', async function(next){
    const user = this
    await Task.deleteMany({owner: user._id}) // delete all tasks where owner is same as user id before it is removed
    next()
})


const User = mongoose.model('User', userSchema) // new model



module.exports = User