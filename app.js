const express = require("express")
const booksPath = require("./routes/books")
const authorsPath = require("./routes/authors")
const logger = require("./middlewares/logger")
const mongoose = require("mongoose")
// Import dotenv
const dotenv = require("dotenv")
dotenv.config()

// Connect to database
mongoose.connect(process.env.MONGO_URI)    // Returns promise
        .then(() => console.log('Connected to MongoDb'))
        .catch((error) => console.log('Connection Failed to mongodb', error))

// Init App
const app = express()

// Apply MIDDLEWARE
app.use(express.json()) // Converts json to js-object
app.use(logger)

// Routes
app.use("/api/books", booksPath)
app.use("/api/authors", authorsPath)



PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}`))

