const mongoose = require("mongoose")
const joi = require("joi")
const { validateCreateBook } = require("./Book")



const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 200,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true})


const User = mongoose.model("User", UserSchema)



function validateResigterUser(obj){
    const schema = joi.object({
        email: joi.string().trim().min(5).max(100).required().email(),
        username: joi.string().trim().min(2).max(200).required(),
        password: joi.string().trim().min(6).required(),
        isAdmin: joi.bool(),
    })

    return schema.validate(obj)
}

function validateLoginUser(obj){
    const schema = joi.object({
        email: joi.string().trim().min(5).max(100).required().email(),
        password: joi.string().trim().min(6).required(),
    })

    return schema.validate(obj)
}

function validateUpdateUser(obj){
    schema = joi.object({
        email: joi.string().trim().min(5).max(100).email(),
        username: joi.string().trim().min(2).max(200),
        password: joi.string().trim().min(6),
        isAdmin: joi.bool(),
    })

    return schema.validate(obj)
}



module.exports = {
    User,
    validateResigterUser,
    validateLoginUser,
    validateUpdateUser,
}