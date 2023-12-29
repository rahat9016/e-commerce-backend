const express = require("express")
const { validationSignupRequest, isRequestValidated, validationSigningRequest } = require("../../../validation/User")
const { signup, signing } = require("../../../controller/admin/auth")
const router = express.Router()


// sing-up
router.post("/signup", validationSignupRequest, isRequestValidated, signup)
// signing
router.post("/signing", validationSigningRequest, isRequestValidated, signing)


module.exports = router