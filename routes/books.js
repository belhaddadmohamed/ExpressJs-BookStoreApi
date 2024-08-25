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



// Routes
// /api/books
router.route("/").get(getAllBooks)
                 .post(verifyTokenAndAdmin, createBook)

// /api/bookks/:id
router.route("/:id").get(getBookById)                 
                    .put(verifyTokenAndAdmin, updateBook)
                    .delete(verifyTokenAndAdmin, deleteBook)


// Export the module router
module.exports = router