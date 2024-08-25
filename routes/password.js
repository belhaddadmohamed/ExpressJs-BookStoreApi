const express = require("express");
const { getForgotPasswordView, postForgotPasswordView } = require("../controllers/passwordController");
const router = express.Router()


// /password/forgot-password
router.route("/forgot-password").get(getForgotPasswordView)
                                .post(postForgotPasswordView)


module.exports = router
