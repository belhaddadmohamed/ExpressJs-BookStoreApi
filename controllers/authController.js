
const asyncHandler = require("express-async-handler")   // Try/Catch handler 
const {User, validateLoginUser, validateResigterUser} = require("../models/User")
const bcrypt = require('bcrypt');   // Password encryption


/**
 * @desc    Register new user
 * @route   /api/auth/register
 * @method  POST
 * @access  public
 */
const register = asyncHandler(async (req, res) => {
    // Fields validation
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

    // Save user in database
    user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    })
    const result  = await user.save()

    // Don't give the password to the user --> Give the token instead
    const {password, ...other} = result._doc
    const token = user.generateToken()  // Method in User class

    
    res.status(201).json({...other,  token})
})




/**
 * @desc    Login new user
 * @route   /api/auth/login
 * @method  POST
 * @access  public
 */
const login = asyncHandler(async (req, res) => {
    // Fields validation
    const {error} = validateLoginUser(req.body)
    if(error){
        return res.status(400).json({message: error.details[0].message})
    }

    // Get the user
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
    // Response: token + user without password
    const token = user.generateToken()
    const {password, ...other} = user._doc

    res.status(200).json({...other, token})

})



module.exports = {
    register,
    login
}