const express = require("express")
const booksPath = require("./routes/books")
const authorsPath = require("./routes/authors")
const mongoose = require("mongoose")

// Connect to database
mongoose.connect("mongodb://localhost/books_db")    // Returns promise
        .then(() => console.log('Connected to MongoDb'))
        .catch((error) => console.log('Connection Failed to mongodb', error))

// Init App
const app = express()

// Apply MIDDLEWARE
app.use(express.json()) // Converts json to js-object

// Routes
app.use("/api/books", booksPath)
app.use("/api/authors", authorsPath)



PORT = 5000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))

