// REMOVE A GIVEN TASK BY ID THEN GET THE NUMBER OF INCOMPLETE TASKS

require('../src/db/mongoose')
const Task = require('../src/models/task')

/*Task.findByIdAndDelete('609bd7b2d5663dac06b55542').then(()=>{
    return Task.countDocuments({completed:false})
}).then((result) =>{
    console.log(result)
}).catch((e)=>{
    console.log(e)
})*/

// USING ASYNC - AWAIT

const deleteTaskAndCount = async (id)=>{
    await Task.findByIdAndDelete('609bd7919028616f87c48945')
    const count = await Task.countDocuments({completed:false})
    return count
}

deleteTaskAndCount('609bd7919028616f87c48945').then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})