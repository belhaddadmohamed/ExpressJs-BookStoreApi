const asyncHandler = require("express-async-handler")   // Try/Catch handler 
const {Book, validateCreateBook, validateUpdatedBook} = require("../models/Book")


/**
 * @desc    Get all books
 * @route   /api/books
 * @method  GET
 * @access  public
 */
const getAllBooks = asyncHandler( async (req, res) =>  {
    const {minPrice, maxPrice} = req.query
    let books;
    if(minPrice && maxPrice){
        books = await Book.find({price: {$gte:minPrice, $lte:maxPrice}}).populate("author", ["name"])    // --/books?query=....
    }else{
        books = await Book.find().populate("author", ["name"])  // populate(): to get the full foreign object attributes
    }
    res.json(books)
})



/**
 * @desc    Get book by id
 * @route   /api/books/:id
 * @method  GET
 * @access  public
 */
const getBookById = asyncHandler(async (req, res) =>  {
    const book = await Book.findById(req.params.id).populate("author")  // populate(): to get the full foreign object    
    if(book){
        res.status(200).json(book)
    }else{
        res.status(404).json({message: "Book was not found"})
    }
})



/**
 * @desc    Create new book
 * @route   /api/books
 * @method  POST
 * @access  private (Only admin)
 */
const createBook = asyncHandler( async (req, res) => {
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
})



/**
 * @desc    Update a book
 * @route   /api/books/:id
 * @method  PUT
 * @access  private (Only admin)
 */
const updateBook = async (req, res) => {
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

}



/**
 * @desc    Delete a book
 * @route   /api/books/:id
 * @method  DELETE
 * @access  private (Only admin)
 */
const deleteBook = asyncHandler(async (req, res) => {

    const book = await Book.findById(req.params.id)
    if(book){
        const result = await Book.findByIdAndDelete(req.params.id)
        res.status(200).json({message: "Book has been deleted"})
    }else{
        res.status(404).json({message: "Book is not found"})
    }
})




module.exports = {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook
}