const express = require("express")
const router = express.Router()
const asyncHandler = require("express-async-handler")   // Try/Catch handler 
const {User} = require("../models/User")


/**
 * @desc    Get all books
 * @route   /api/books
 * @method  GET
 * @access  public
 */