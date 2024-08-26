const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")


const storage = multer.diskStorage({
    // Where to upload the file
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, "../images"))
    } ,
    // Uploaded file
    filename: function(req, file, cb){
        console.log(file.originalname)
        cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname)   // ":" is not allowed in windows filenamea
    }
})

const upload = multer({ storage })  // equivalent to : {storage:storage}

router.post("/", upload.single("image"), (req, res) => {
    res.status(200).json({message:"Image uploaded successfully"})
})

module.exports = router 


