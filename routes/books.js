const express = require("express")
const router = express.Router()
const asyncHandler = require("express-async-handler")   // Try/Catch handler 
const {Book, validateCreateBook, validateUpdatedBook} = require("../models/Book")
// Get token verifications
const {verifyTokenAndAdmin} = require("../middlewares/verifyToken")


/**
 * @desc    Get all books
 * @route   /api/books
 * @method  GET
 * @access  public
 */
router.get("/", asyncHandler( async (req, res) =>  {
    const books = await Book.find().populate("author", ["name"])
    res.json(books)
}))


/**
 * @desc    Get book by id
 * @route   /api/books/:id
 * @method  GET
 * @access  public
 */
router.get("/:id", asyncHandler(async (req, res) =>  {
    const book = await Book.findById(req.params.id).populate("author")  // populate() to get the full object    
    if(book){
        res.status(200).json(book)
    }else{
        res.status(404).json({message: "Book was not found"})
    }
}))


/**
 * @desc    Create new book
 * @route   /api/books
 * @method  POST
 * @access  private (Only admin)
 */
router.post("/", verifyTokenAndAdmin, asyncHandler( async (req, res) => {
    // Form validation
    const {error} = validateCreateBook(req.body)
    
    if(error){
        return res.status(201).json({message: error.details[0].message})
    }

    // Create the new book object
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        cover: req.body.cover,
    })

    // Save the book in the database
    const resutlt = await book.save()

    res.status(201).json(resutlt);  // 201 == created successfully
}))


/**
 * @desc    Update a book
 * @route   /api/books/:id
 * @method  PUT
 * @access  private (Only admin)
 */
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    // Form validation
    const {error} = validateUpdatedBook(req.body)
    
    if(error){
        return res.status(201).json({message: error.details[0].message})
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            cover: req.body.cover,
        }
    }, {new:true})

    res.status(201).json(updatedBook)
 
    // res.status(404).json({message: "Book is not found"})

})


/**
 * @desc    Delete a book
 * @route   /api/books/:id
 * @method  DELETE
 * @access  private (Only admin)
 */
router.delete ("/:id", verifyTokenAndAdmin, asyncHandler(async (req, res) => {

    const book = await Book.findById(req.params.id)
    if(book){
        const result = await Book.findByIdAndDelete(req.params.id)
        res.status(200).json({message: "Book has been deleted"})
    }else{
        res.status(404).json({message: "Book is not found"})
    }
}))




// Export the module router
module.exports = router