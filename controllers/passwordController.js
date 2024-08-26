const expressAsyncHandler = require("express-async-handler");
const { User, validateChangePassword } = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const nodeMailer = require("nodemailer")


/**
 * @desc    Get forgot password view
 * @route   /password/forgot-password
 * @method  GET
 * @access  public
 */
module.exports.getForgotPasswordView = expressAsyncHandler((req, res) => {
    res.render('forgot-password')
})



/**
 * @desc    Send forgot password link
 * @route   /password/forgot-password
 * @method  POST
 * @access  public
 */
module.exports.sendForgotPasswordLink = expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({email:req.body.email})
    // console.log(user)
    if(!user){
        return res.status(404).json({message:'User not found!'})
    }
    
    const secret = process.env.JWT_SECRET_KEY + user.password   // باش  يتغير الرقم السري وبالتالي المستخدم راح يبدل مرة وحدة 
    const token = jwt.sign({email:user.email, id:user.id}, secret, {
        expiresIn:"10m"
    })

    const link = `http://localhost:8000/password/reset-password/${user.id}/${token}`
    
    const transporter = nodeMailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_HOST,
            pass: process.env.EMAIL_PASS
        }
    })

    const mailOptions = {
        sender: process.env.EMAIL_HOST,
        to: user.email,
        subject: 'Reset Password',
        html: `<div>
                    <h4>Click on the link below to reset your password</h4>
                    <a href="${link}">${link}</a>
               </div>`
    }

    transporter.sendMail(mailOptions, function(error, success){
        if(error){
            console.log(error)
            res.status(500).json({message:"Something went wrong!!"})
        }else{
            console.log("Email sent: " + success.response)
            res.render("link-sent")
        }
    })

})



/**
 * @desc    get reset password view
 * @route   /password/reset-password/:userId/token
 * @method  GET
 * @access  public
 */
module.exports.getResetPasswordView = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId)
    if(!user){
        return res.status(404).json({message:'User not found!'})
    }
    
    const secret = process.env.JWT_SECRET_KEY + user.password   // باش  يتغير الرقم السري وبالتالي المستخدم راح يبدل مرة وحدة 
    try {
        jwt.verify(req.params.token, secret)
        res.render('reset-password', {email:user.email})
    } catch (error) {
        res.json({message:error})
    }
})


/**
 * @desc    Reset password 
 * @route   /password/reset-password/:userId/token
 * @method  POST
 * @access  public
 */
module.exports.resetPassword = expressAsyncHandler(async (req, res) => {
    // Password validation
    const {error} = validateChangePassword(req.body)
    if(error){
        return res.status(400).json({message:error.details[0].message})
    }

    // Get the user
    const user = await User.findById(req.params.userId)
    if(!user){
        return res.status(404).json({message:'User not found!'})
    }

    const secret = process.env.JWT_SECRET_KEY + user.password   // باش  يتغير الرقم السري وبالتالي المستخدم راح يبدل مرة وحدة 
    try {
        // Verify token
        jwt.verify(req.params.token, secret)
        // Password encryption
        const saltRounds = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, saltRounds)
        user.password = req.body.password
        await user.save()
        // Render view
        res.render('success-password')
    } catch (error) {
        console.log(error)
        res.json({message:"error"})
    }
})