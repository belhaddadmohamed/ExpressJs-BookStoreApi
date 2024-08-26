const express = require("express")
const logger = require("./middlewares/logger")     // Import middlewares
const {notFound, errorHandler} = require("./middlewares/errors")     // Import error handler middlwares
require("dotenv").config()    // Import dotenv
const path = require("path")       // Import path
const {helmet} = require("helmet")


// Connect to database
const connectToDB = require("./.config/db")     
const { default: helmet } = require("helmet")
connectToDB()

// Init App
const app = express()

// Static folder (images...)
app.use(express.static(path.join(__dirname, "images")))     // Pour afficher l'image utilisant URL (http://localhost:8000/img_name.jpg)

// Apply MIDDLEWARE
app.use(express.json()) // Converts json to js-object
app.use(logger)
app.use(express.urlencoded({extended:false}))

// Routes
app.use("/api/books", require("./routes/books"))
app.use("/api/authors", require("./routes/authors"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/users", require("./routes/users"))
app.use("/api/upload", require("./routes/upload"))
app.use("/password", require("./routes/password"))

// Error handler middleware
app.use(notFound)
app.use(errorHandler)

// Template engine
app.set('view engine', 'ejs')

PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}`))

