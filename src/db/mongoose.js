const { Int32 } = require('bson')
const mongoose = require('mongoose')


mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{ // specify name of db here
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true, // creates indexes which helps in quick data access
    useFindAndModify:false
})


// CONNECT TO DATABASE


// __v stores version of the document
