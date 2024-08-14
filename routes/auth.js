const express = require("express")
const router = express.Router()
const asyncHandler = require("express-async-handler")   // Try/Catch handler 
const {User, validateLoginUser, validateResigterUser} = require("../models/User")

// Password encryption
const bcrypt = require('bcrypt');

// JWT
const jwt = require("jsonwebtoken")



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

    // Check the user if already existed
    let user = await User.findOne({email: req.body.email})
    if(user){
        return res.status(400).json({message: "User already registered!!"})
    }

    // Password encryption
    const saltRounds = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, saltRounds)

    user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        isAdmin: req.body.isAdmin,
    })
    const result  = await user.save()

    // Don't give the password to the user --> Give the token instead
    const {password, ...other} = result._doc
    const token = jwt.sign({id: user._id, username:user.username}, process.env.JWT_SECRET_KEY)

    
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

    // Check the user if it is existed
    let user = await User.findOne({email: req.body.email})
    if(!user){
        return res.status(400).json({message: "Invalid email or password!!"})
    }

    // Compare the entered password with the database password (encrypted!!)
    const isMatchPassword = await bcrypt.compare(req.body.password, user.password)
    if(!isMatchPassword){
        return res.status(400).json({message: "Invalid email or password!!"})
    }

    // Generate a token
    const token = jwt.sign({id: user._id, idAdmin: user.isAdmin}, process.env.JWT_SECRET_KEY)
    const {password, ...other} = user._doc

    res.status(200).json({...other, token})

}))




module.exports = router