const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')

router.get('/test', (req,res)=>{
    res.send('From a new file')
})

// only sign up and login route is public. Every other thing requires you to be an authenticated user
// we use authentication tokens to ensure that the right user is performing the required function only in his/her account
router.post('/users', async (req,res) => { // CREATE NEW USER - sign up
    /*console.log(req.body)
    res.send('Testing')*/
    // console.log(req.body)
    const user = new User(req.body)
   
    try{
        await user.save() // everything that happens after this is once user is saved in db
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
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

router.post('/users/login', async(req,res)=>{
    try{
        // we can write the entire checking code here also but we're making a reusable function
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken() // we don't do User as each user has a unique auth token so we don't need to access the entire collection
        res.send({user, token}) // we can do user.getPublicProfile and define that as a method too
        console.log(user)
    } catch(e){
        res.status(400).send()
    }
})

// with this any user can see details of all other users, but we want them to see  only their own details
// router.get('/users', auth , async (req,res) => { // FETCH ALL USERS - second argument is middleware to be used
//     try{
//         const users = await User.find({})
//         res.send(users)
//     } catch(e){
//         res.status(500).send()
//     }
//     // User.find({}).then((users)=>{
//     //     res.send(users)
//     // }).catch((e)=>[
//     //     res.status(500).send() // 500 coz server error like not connecting to db. No need to send e as status 500 is self explanatory
//     // ]) // {name:"Nilesh"} - can add filters like these
// })

// In the logout route, we are taking the request (req), which has a user property (the current user) which has a tokens property (which is an array of all tokens that user has used). 
// We want to remove from that array of tokens the single token we are sending with the logout request. To do that, we are setting the user's array of tokens to be a filtered list that does NOT include the current token.
// To accomplish that, we use the .filter() method on the tokens array. This method iterates over the array, testing the boolean value returned by the filtering function provided in the callback: token.token !== req.token.
// Here, token.token is taking the token value from each token object in the user's token array (since the token array is a list of token objects, each of which has a _id and a token key/value pair). 
// We check to see, one by one (since .filter() iterates over the array), if any of the user's tokens match the req.token (the specific token accompanying the request to logout). If it does, then for that token.token the .filter() method returns false. 
// This removes it from the req.user.tokens array, thereby getting rid of the authentication for that specific login instance of a user.


router.post('/users/logout', auth, async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{ // checl through each token in the tokens array
            return token.token != req.token // token.token is value of token in the token object
        })
        await req.user.save()
        res.status(200).send()
    } catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req,res)=>{ // in case you want to logout of all devices
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    } catch(e){
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req,res)=>{
    res.send(req.user)
})

// get user by id not needed as you only have permission to see your own details

router.patch('/users/me', auth, async (req,res)=>{ // UPDATE USER BY ID
    id = req.user._id
    user = req.user
    const allowedUpdates = ['name', 'email', 'password', 'age'] // only these fields can be edited
    const updates = Object.keys(req.body) // properties passed in request
    const isValidOperation = updates.every((update) => { // every gives us each key one by one in updates
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send({error:'Invalid Update!'})
    }
    try{
        // const user = await User.findByIdAndUpdate(id, req.body, { new :true, runValidators: true}) // new ensures the object returned is the updated user and runValidators ensures validation checks happen on the updated fields as well
        // findByIdAndUpdate bypasses mongoose and performs direct operation on database without considering our middleware code. So we have to restructure the code.

        // const user = await User.findById(id)
        updates.forEach((update) => { // iterating through every field
            user[update] = req.body[update] // update values
        })

        await user.save() // save in db. this is automated in findByIdAndUpdate

    } catch(e){
            res.status(400).send(e) // validation errors as invalid info entered
    }
})

router.delete("/users/me", auth, async (req,res) => { // only delete your own profile
    const id = req.user._id
    try{
        // auth takes care of authentication so no need to explicitly check if such a user exists
    //    const user = await User.findByIdAndDelete(id)
    //    if(!user){
    //        res.status(404).send()
    //    }
    //    else{
    //        res.send(user)
    //    }
        await req.user.remove() // similar to res.send(), we delete current auth user
        res.send(req.user)
    } catch(e){
           res.status(500).send()
    }
})


module.exports = router