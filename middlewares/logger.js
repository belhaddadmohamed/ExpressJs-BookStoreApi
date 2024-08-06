
const logger = (req, res, next) => {
    console.log("Helllo logger")
    next()
}

module.exports = logger