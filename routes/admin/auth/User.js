const express = require("express")
const User = require("../../../model/User")
const { validationSignupRequest, isRequestValidated } = require("../../../validation/User")
const router = express.Router()


// sing-up
router.post("/signup", validationSignupRequest, isRequestValidated, (req,res)=>{
    const newUser = new User({...req.body})
    newUser.save().then(res => {
        console.log(res)
    }).catch(error=> {
        console.log(error)
    })
})



module.exports = router