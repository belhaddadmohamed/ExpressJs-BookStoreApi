const express = require("express")
const router = express.Router()
const asyncHandler = require("express-async-handler")   // Try/Catch handler 
const {User, validateLoginUser, validateResigterUser} = require("../models/User")

// Password encryption
const bcrypt = require('bcrypt');


/**
 * @desc    Register new user
 * @route   /api/auth/register
 * @method  POST
 * @access  public
 */
router.post("/register", asyncHandler(async (req, res) => {
    const {error} = validateResigterUser(req.body)
    if(error){
        return res.status(400).json({message: error.details[0].message})
    }

    // Password encryption
    const saltRounds = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, saltRounds)

    // Check the user if already existed
    let user = await User.findOne({email: req.body.email})
    if(user){
        return res.status(400).json({message: "User already registered!!"})
    }

    user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        isAdmin: req.body.isAdmin,
    })

    const result  = await user.save()
    // Don't give the password to the user --> Give the token instead
    const {password, ...other} = result._doc
    const token = null

    
    res.status(201).json({...other,  token})
}))





/**
 * @desc    Login new user
 * @route   /api/auth/login
 * @method  POST
 * @access  public
 */
router.post("/login", asyncHandler(async (req, res) => {
    const {error} = validateLoginUser(req.body)
    if(error){
        return res.status(400).json({message: error.details[0].message})
    }

    
}))




module.exports = router