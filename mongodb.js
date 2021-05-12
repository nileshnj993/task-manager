// CRUD - CREATE, READ, UPDATE, DELETE

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient // used to initialize the client and connect to database
const ObjectId = mongodb.ObjectID
// const { MongoClient, ObjectID } = require('mongodb)

const id = new ObjectId()
// console.log(id)
// console.log(id.getTimestamp())
// console.log(id.id) // binary representation of the object ID
// console.log(id.toHexString()) // convert to string
const connectionURL = 'mongodb://127.0.0.1:27017' // connection url to database locally. Don't use localhost in the url as it slows down
const databaseName = 'task-manager' // created automatically if not already created


MongoClient.connect(connectionURL, {useNewUrlParser:true}, (error,client) => { // url parser helps us parse url so we can connect to db seamlessly
    if(error){
        console.log('Unable to connect to database!')
    }
    else{
        const db = client.db(databaseName)

        // CREATION
        
       /* db.collection('Users').insertOne({
            _id: id, // use this to set custom id's
            name:'Vikram',
            age:27
        }, (error, result) => { // callback to print any message once insertOne finishes
            if(error){
                console.log('Unable to insert user')
            }
            else{
                console.log(result.ops) // this is just the json format of latest object being added
            }
        })*/

        // INSERT MANY AT ONCE

       /* db.collection('Users').insertMany([
        {
            name:'Ram',
            age:28
        },

        {
            name:'Mahesh',
            age:32
        }

        ], (error,result)=>{
        if(error){
            console.log(error)
        }
        else{
            console.log(result.ops)
        }
    })*/

       /* db.collection('Tasks').insertMany([
            {
                description:'Do homework',
                completed:false
            },

            {
                description: 'Eat dinner',
                completed:true
            },
            
            {
                description: 'Watch TV',
                completed : true
            }
        ], (error,result) => {
            if(error){
                console.log(error)
            }
            else{
                console.log(result.ops) // this is just the json format of all objects being added
            }
        })*/

        // READ

  /*      db.collection('Users').findOne({name:'Nilesh',age:20}, (error,user)=>{ // returns first document that matches required find condition
            if(error){
                console.log('Unable to fetch')
            }
            else{
                console.log(user)
            }
        })*/

       /* db.collection('Users').findOne({_id:new mongodb.ObjectID("608db96ec406d6d76b5d947e")}, (error, user)=>{ // we can't pass the ID directly as it is stored in binary form 
            if(error){
                console.log('Unable to fetch!')
            }
            else{
                console.log(user)
            }
        })*/

        db.collection('Users').find({age:27}).toArray((error, users)=>{
            console.log(users)
            
        }) // find returns a cursor which is basically a pointer to the data
    
        db.collection('Users').find({age:27}).count((error, count)=>{
            console.log(count) // number of rows satisfying the find condition
        })

        db.collection('Tasks').findOne({_id:new mongodb.ObjectID("608dab79fee79a207a57220b")}, (error, task) => { // find latest task
            console.log(task)
        })

        db.collection('Tasks').find({completed:false}).toArray((error,tasks)=>{ // find all incomplete tasks
            console.log(tasks)
        })

     /*   const updatePromise = db.collection('Users').updateOne({_id:new mongodb.ObjectID("6089be46edcf6b6d4caad8ca")},{
            $set:{ // used for updating existing values
                name:'Andrew'
            }
        })
        // update returns a promise
        updatePromise.then((result)=>{ // successful updation
            console.log(result)
        }).catch((error)=>{
            console.log(error)
        })*/

        db.collection('Users').updateOne({_id:new mongodb.ObjectID('6089be46edcf6b6d4caad8ca')}, {
           /* $set:{
                name:'John'
            }*/

            $inc:{
                age: 1 // amount to be incremented
            }
        }).then((result) => {
            console.log(result)
        }).catch((error) => {
            console.log(error)
        })
        // same as above code just didn't use a separate variable
        
        // in tasks collection set all incomplete tasks to complete
    
        db.collection('Tasks').updateMany({completed:false}, {
            $set:{
                completed:true
            }
        }).then((result) => {
            console.log(result.modifiedCount)
        }).catch((error)=>{
            console.log(error)
        })

        db.collection('Users').deleteMany({age:27}).then((result)=>{
            console.log(result)
        }).catch((error)=>{
            console.log(error)
        })

        db.collection('Tasks').deleteOne(
            {description:"Eat dinner"
        }).then((result)=>{
            console.log(result)
        }).catch((error)=>{
            console.log(error)
        })
    }
})

// MONGOOSE HELPS US RETAIN CRUD FUNCTIONALITY WHILE ADDING EXTRA FEATURES SUCH AS DATA VALIDATION, SETTING DATA TYPES FOR FIELDS, AUTHORIZATION ETC
