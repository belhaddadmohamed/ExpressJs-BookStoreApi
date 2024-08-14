const express = require("express")
const router = express.Router()
const asyncHandler = require("express-async-handler")   // Try/Catch handler 
const {User, validateUpdateUser} = require("../models/User")
const bcrypt = require("bcrypt")
// Verify token middleware
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("../middlewares/verifyToken")



/**
 * @desc    Update user
 * @route   /api/users/:id
 * @method  POST
 * @access  private
 */
router.put('/:id', verifyTokenAndAuthorization, asyncHandler(async (req, res) => {

    // Validate the request information
    const {error} = validateUpdateUser(req.body)
    if(error){
        return res.status(400).json({message: error.details[0].message})
    }

    // Hash the password
    if(req.body.password){
        const saltRounds = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, saltRounds)
    }

    // Update the user information
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
        }
    }, {new: true}).select("-password") // Don't give me the password

    res.status(200).json(updatedUser)
}))




/**
 * @desc    Get users
 * @route   /api/users
 * @method  GET
 * @access  private
 */
router.put('/:id', verifyTokenAndAdmin, asyncHandler(async (req, res) => {
    const users = User.find()
    res.status(200).json(users)
}))





module.exports = router