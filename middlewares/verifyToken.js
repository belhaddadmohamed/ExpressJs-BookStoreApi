const jwt = require("jsonwebtoken")


function verifyToken(req, res, next) {
    const token = req.headers.token

    if(token){
        try {
            const decocded = jwt.verify(token, process.env.JWT_SECRET_KEY)  // First we want to verify the secret_key
            req.user = decocded   // Add the decoded user to the request
            next()   // Keep going
        } catch (error) {
            res.status(401).json("Invalid token !!")
        }
    }else{
        res.status(401).json("No token provided !!")
    }
}


// User authorization
function verifyTokenAndAuthorization(req, res, next){
    verifyToken(req, res, () => {
        // Next middleware
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            return res.status(403).json({message: "You're not allowed!!"})
        }
    })
}


// Admin authorization
function verifyTokenAndAdmin(req, res, next){
    verifyToken(req, res, () => {
        // Next middleware
        if(req.user.isAdmin){
            next()
        }else{
            return res.status(403).json({message: "You're not allowed, only admin!!"})
        }
    })
}


module.exports = {
    verifyToken, 
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
}