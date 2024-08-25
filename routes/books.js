const express = require("express")
// Token verification
const {verifyTokenAndAdmin} = require("../middlewares/verifyToken")
const router = express.Router()
const {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
} = require("../controllers/bookController")



// Routes / Protected_Routes
router.get("/", getAllBooks)
router.get("/:id", getBookById)
router.post("/", verifyTokenAndAdmin, createBook)
router.put("/:id", verifyTokenAndAdmin, updateBook)
router.delete ("/:id", verifyTokenAndAdmin, deleteBook)


// Export the module router
module.exports = router