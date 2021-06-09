const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next) => {
    // console.log('auth middleware')
    try{
        const token = req.header('Authorization').replace('Bearer ','') // accesses jwt being sent in header
        // console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id:decoded._id, 'tokens.token': token}) // checks if user still has the token and it has not expired
    
       if(!user){
            throw new Error()
        }
        req.token = token // so that each login from a different device also has a unique token associated
        req.user = user // so that router can directly access instead of performing findOne again
        next() // run route handler
    } catch(e){
        res.status(401).send({error:'Please Authenticate.'})
    }
   
}

module.exports = auth