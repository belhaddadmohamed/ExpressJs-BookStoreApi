const expressAsyncHandler = require("express-async-handler");



/**
 * @desc    Get forgot password view
 * @route   /password/forgot-password
 * @method  GET
 * @access  public
 */
module.exports.getForgotPasswordView = expressAsyncHandler(async (req, res) => {
    res.render('forgot-password')
})



/**
 * @desc    Post forgot password view
 * @route   /password/forgot-password
 * @method  POST
 * @access  public
 */
module.exports.postForgotPasswordView = expressAsyncHandler(async (req, res) => {
    res.render('forgot-password')
})