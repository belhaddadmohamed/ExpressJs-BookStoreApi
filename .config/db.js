const mongoose = require("mongoose")


async function connectToDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI)    // Returns promise
        console.log('Connected to MongoDb')
    } catch (error) {
        console.log('Connection Failed to mongodb', error)
    }
} 

module.exports = connectToDB


// mongoose.connect(process.env.MONGO_URI)    // Returns promise
// .then(() => console.log('Connected to MongoDb'))
// .catch((error) => console.log('Connection Failed to mongodb', error))