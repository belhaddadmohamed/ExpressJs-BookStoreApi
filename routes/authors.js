const express = require("express")
const router = express.Router()
// Get token verfication middlwares
const {verifyTokenAndAdmin} = require("../middlewares/verifyToken")
const {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor
} = require("../controllers/authorController")

// /api/authors
router.route("/").get(getAllAuthors)
                 .post(verifyTokenAndAdmin, createAuthor)
// /api/authors/:id
router.route("/:id").get(getAuthorById)
                    .put(verifyTokenAndAdmin, updateAuthor)
                    .delete(verifyTokenAndAdmin, deleteAuthor)




module.exports = router