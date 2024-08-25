const {Author, validateAuthorCreate, validateAuthorUpdate} = require("../models/Author") 
const asyncHandler = require("express-async-handler")



/**
 * @desc    Get all authors
 * @route   /api/authors
 * @method  GET
 * @access  public
 */
const getAllAuthors =  asyncHandler(async (req, res) => {
    // const authors = await Author.find().sort({name: -1}).select("name -_id")     // 1/-1 is the reverse value
    const {pageNumber} = req.query
    authorsPerPage = 2
    const authors = await Author.find().skip((pageNumber - 1) * authorsPerPage).limit(authorsPerPage)
    res.status(200).json(authors)
}
)



/**
 * @desc    Get author by id
 * @route   /api/authors/:id
 * @method  GET
 * @access  public
 */
const getAuthorById =  asyncHandler(async (req, res) => {
    const author = await Author.findById(req.params.id)
    if(author){
        res.status(200).json(author)
    }else{
        res.status(404).json({message: "Author doesn't exist"})
    } 
})



/**
 * @desc    Create new author
 * @route   /api/authors/:id
 * @method  POST
 * @access  private (Only admin)
 */
const createAuthor =  asyncHandler(async (req, res) => {
    // Validate user entries
    const {error} = validateAuthorCreate(req.body)

    if(error){
        return res.status(400).json({message: error.details[0].message})
    }

    // Create new author
    const author = new Author({
        name: req.body.name,
        nationality: req.body.nationality,
        image: req.body.image,
    })

    // Save in databasae
    const result = await author.save()

    // Success message
    res.status(201).json(result)

})



/**
 * @desc    Update author by id
 * @route   /api/authors/:id
 * @method  PUT
 * @access  private (Only admin)
 */
const updateAuthor = async (req, res) => {
    // Validate user entries
    const {error} = validateAuthorUpdate(req.body)

    if(error){
        return res.status(400).json({message: error.details[0].message})
    }

    try{
        const author = await Author.findByIdAndUpdate(req.params.id, {
            $set: {
                name: req.body.name,
                nationality: req.body.nationality
            }
        }, {new:true})  // new:true to affect the new updated author

        res.status(201).json(author) 

    }catch(err){
        res.status(404).json({message : err.message})
    }
  
}



/**
 * @desc    Delete an author by id
 * @route   /api/authors/:id
 * @method  DELETE
 * @access  private (Only admin)
 */
const deleteAuthor = async (req, res) => {
    try{
        const author = await Author.findById(req.params.id)
        if(author){
            await Author.findByIdAndDelete(req.params.id)
            res.status(201).json({message : "Author has been deleted"})    
        }else{
            res.status(404).json({message : "Author was not found"})
        }

    }catch(err){
        res.status(500).json({message: err.message})
    }
}



module.exports = {
    getAllAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor
}