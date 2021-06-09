const { Int32 } = require('bson')
const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URL,{ // specify name of db here
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true, // creates indexes which helps in quick data access
    useFindAndModify:false
})


// CONNECT TO DATABASE


// __v stores version of the document
