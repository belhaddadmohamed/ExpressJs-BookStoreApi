const mongoose = require("mongoose")
const Joi = require("joi")


// Create book schema 
const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 250,
        minlength: 3,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
        required: true,
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    cover: {
        type: String,
        enum: ["Soft Cover", "Hard Cover"],
        required: true,
    }
}, {
    timestamps: true,
})

// Create book model
const Book = mongoose.model("Book", BookSchema)




// Validate created book
function validateCreateBook(obj){
    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(250).required(),  // trim() to remove white space
        author: Joi.string().required(),
        price: Joi.number().min(0).required(),
        cover: Joi.string().valid("Soft Cover", "Hard Cover").required(),
    })

    return schema.validate(obj)
}

// Validate created book
function validateUpdatedBook(obj){
    const schema = Joi.object({
        title: Joi.string().trim().min(3).max(250),  // trim() to remove white space
        author: Joi.string(),
        price: Joi.number().min(0),
        cover: Joi.string().valid("Soft Cover", "Hard Cover"),
    })

    return schema.validate(obj)
}


module.exports = {
    Book,
    validateCreateBook,
    validateUpdatedBook,
}