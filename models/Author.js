const mongoose = require("mongoose")
const joi = require("joi")


const AuthorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    nationality: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 80,
    },
    image: {
        type: String,
        default: "default-avatar.png",
    }
},{
    timestamps:true
})


const Author = mongoose.model("Author", AuthorSchema)



function validateAuthorUpdate(obj){
    schema = joi.object({
        name: joi.string().trim().min(2).max(100).required(),
        nationality: joi.string().trim().required(),
        image: joi.string().trim(),
    })

    return schema.validate(obj)
}


function validateAuthorCreate(obj){
    schema = joi.object({
        name: joi.string().trim().min(2).max(100).required(),
        nationality: joi.string().trim().required(),
        image: joi.string().trim(),
    })

    return schema.validate(obj)
}


// ===================================================================
module.exports = {
    Author, 
    validateAuthorCreate,
    validateAuthorUpdate
}