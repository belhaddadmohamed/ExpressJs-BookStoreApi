const express = require("express")
const router = express.Router()
// Verify token middlewares
const { verifyToken, verifyTokenAndAdmin, verifyTokenAndAuthorization } = require("../middlewares/verifyToken")
const { getAllUsers, updateUserById, getUserById, deleteUserById } = require("../controllers/userController")


// /api/users/
router.get('/', verifyTokenAndAdmin, getAllUsers)
router.put('/:id', verifyTokenAndAuthorization, updateUserById)
router.get('/:id', verifyTokenAndAuthorization, getUserById)
router.delete('/:id', verifyTokenAndAuthorization, deleteUserById)



module.exports = router