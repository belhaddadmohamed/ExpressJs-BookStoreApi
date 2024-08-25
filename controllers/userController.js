const asyncHandler = require("express-async-handler")   // Try/Catch handler 
const {User, validateUpdateUser} = require("../models/User")
const bcrypt = require("bcrypt")





/**
 * @desc    Get users
 * @route   /api/users
 * @method  GET
 * @access  private (Only admin & user himself)
 */
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password")    // Don't provide password (for security)
    res.status(200).json(users)
})



/**
 * @desc    Get user by id
 * @route   /api/users/:id
 * @method  GET
 * @access  private (Only admin & user himself)
 */
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password")    // Don't provide password (for security)
    if(user){
        res.status(200).json(user)
    }else{
        res.status(404).json({message: "User not found"})
    }
})



/**
 * @desc    Update user
 * @route   /api/users/:id
 * @method  POST
 * @access  private (Only admin & user himself)
 */
const updateUserById = asyncHandler(async (req, res) => {

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
})


/**
 * @desc    Delte user by id
 * @route   /api/users/:id
 * @method  DELETE
 * @access  private (Only admin & user himself)
 */
const deleteUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password")    // Don't provide password (for security)
    if(user){
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json({message: "User deleted successfully!"})
    }else{
        res.status(404).json({message: "User not found"})
    }

})



module.exports = {
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
}