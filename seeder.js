const { books } = require("./data");
const { Book } = require("./models/Book");
const connectToDB = require("./.config/db")
require("dotenv").config()

// Connect to database (Because it is seperate from app.js)
connectToDB()

// Import books (seeding database)
const importBooks = async () => {
    try {
        await Book.insertMany(books)
        console.log("Books imported")
    } catch (error) {
        console.log(error)
        process.exit(1)     // Disconnect database
    }
}

// Remove books
const deleteBooks = async () => {
    try {
        await Book.deleteMany()
        console.log("Books deleted")
    } catch (error) {
        console.log(error)
    }
}


// argv[2] the third word in the terminal command (Ex: node seeder -import) => [node][seeder][-import]
if(process.argv[2] === "-import"){
    importBooks()
}else if(process.argv[2] === "-remove"){
    deleteBooks()
}