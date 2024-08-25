const jwt = require("jsonwebtoken")


// User is Authenticated
function verifyToken(req, res, next) {
    // Check token in headers
    const token = req.headers.token

    if(token){
        try {
            const decocded = jwt.verify(token, process.env.JWT_SECRET_KEY)  // First we want to verify the secret_key
            req.user = decocded   // Add the decoded user (Payload) to the request
            next()   // Next middleware
        } catch (error) {
            res.status(401).json("Invalid token !!")
        }
    }else{  // No token in headers
        res.status(401).json("No token provided !!")
    }
}


// User authorization
function verifyTokenAndAuthorization(req, res, next){
    verifyToken(req, res, () => { // Next middleware
        // user in req => is provided in verifyToken()
        // Verify ther token user.id is the same id in url
        if(req.user.id === req.params.id || req.user.isAdmin){  // This can be accessed either by user himself or admin 
            next()
        }else{
            return res.status(403).json({message: "You're not allowed awedi !!"})
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