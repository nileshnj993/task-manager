
const express = require('express')
require('./db/mongoose') // starts up connection to database


const app = express()
const port = process.env.PORT || 3000

// app.use((req,res,next) => { // next is specific to middleware. req, res is same as before.
//     // console.log(req.method, req.path)
//     // next() // without this the route handler will never be called regardless of what we do in middleware

//     if(req.method === 'GET'){
//         res.send('GET requests are disabled')
//     } else{
//         next()
//     }
// })

// middleware for maintenance mode - disable all requests
// app.use((req,res,next)=>{
//     res.status(503).send("Site is currently under maintenance. Please check later!")
//     // no requests will be considered since next() is never
// }) // define in separate file


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

// without middleware: new request -> run route handler

// with middleware: new request -> do something using a function -> run route handler
// we make use of the middleware to authenticate users and move forward accordingly




app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


const Task = require('./models/task')
const User = require('./models/user')
// const main = async () => {
//     // finding user details using task owner ID

//     // const task = await Task.findById("60b4b9789c7839c7f927d4b5")
//     // await task.populate('owner').execPopulate() // this helps us go find all the data associated with the owner attribute in another model 'User'
//     // console.log(task.owner)

//     // finding tasks a user has done based on ID

//     const user = await User.findById("60b4b7e33323a1859d753279")
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks) // we won't create a task array on user model. We instead create a virtual connection between user and task collection

// }

// main()



// const bcrypt = require('bcryptjs') // hashing sensitive info - hashing is one way - we cant decrypt hashed information

// const myfunction = async () => {
//     const password = 'Red12345!' // plain text password
//     const hashedPassword = await bcrypt.hash(password, 8) // returns a promise, 8 is the number of hashing rounds taking place
    
//     console.log(password)
//     console.log(hashedPassword)

//     const isMatch = await bcrypt.compare(password, hashedPassword) // compares hash(plain text pwd) to hashed pwd stored in database to see if correct plain text pwd has been entered
//     console.log(isMatch)
// }

// myfunction()

// const jwt = require('jsonwebtoken')

// const myFunction = async() => { // expiresIn indicates till when token is valid
//     const token = jwt.sign({_id:'abc123'}, 'thisisatest', { expiresIn: '7 days'})// creates an authentication token. first parameter indicates what is the data that can be used to identify uniquely and second parameter is a secret code used to hash the authenticator to ensure integrity and authenticity
//     console.log(token) // prints the random authentication sequence generated - sequence separated by periods, first half is the header which indicates type of authentication used etc and second half indicates our info used to create authentication string (attribute used - id in our case, and timestamp of creation time). third half shows how the signature string has been encoded.

//     const data = jwt.verify(token, "thisisatest") // checks if secret code is same as what was used to generate the token. If same, we get our authentication attributes     console.log(data)

// }

// myFunction()

// const pet = {
//     name: "Tom"
// }
// pet.toJSON = function(){
//    return {}
// }

// console.log(JSON.stringify(pet)) // in res.send, json.stringify is internally called
