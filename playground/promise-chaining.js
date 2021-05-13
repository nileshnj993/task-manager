require('../src/db/mongoose')
const User = require('../src/models/user')

// CHANGE AGE OF A USER AND FETCH THE NUMBER OF OTHER USERS WITH SAME AGE

// We use findByIdAndUpdate instead of updateOne as find methods return the updated object as well

/*User.findByIdAndUpdate('609bf1c04c85c342ddeaaa24', {age:20}).then((user)=>{
    console.log(user)
    return(User.countDocuments({age:20})) // return count for first promise
}).then((result)=>{ // chain first returned value after updating
    console.log(result)
}).catch((e)=>{
    console.log(e)
})*/

const updateAgeAndCount = async (id,age) => { // find user by id and update age, and count number of people with this age
    const user = await User.findByIdAndUpdate(id, {age:age})
    const count = await User.countDocuments({age:age}) // can just write age
    return count
}

updateAgeAndCount('609bf1c04c85c342ddeaaa24', 42).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})