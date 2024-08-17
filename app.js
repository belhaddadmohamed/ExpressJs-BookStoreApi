const express = require("express")
const booksPath = require("./routes/books")
const authorsPath = require("./routes/authors")
const authPath = require("./routes/auth")
const usersPath = require("./routes/users")
// Import middlewares
const logger = require("./middlewares/logger")
// Error handler middlwares
const {notFound, errorHandler} = require("./middlewares/errors")
// Import dotenv
const dotenv = require("dotenv")
const connectToDB = require("./.config/db")
dotenv.config()


// Connect to database
connectToDB()

// Init App
const app = express()

// Apply MIDDLEWARE
app.use(express.json()) // Converts json to js-object
app.use(logger)

// Routes
app.use("/api/books", booksPath)
app.use("/api/authors", authorsPath)
app.use("/api/auth", authPath)
app.use("/api/users", usersPath)

// Error handler middleware
app.use(notFound)
app.use(errorHandler)

PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}`))

