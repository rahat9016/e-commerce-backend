const { check, validationResult } = require("express-validator")
const User = require("../model/User")


exports.validationSignupRequest = [
    check("firstName").notEmpty().withMessage("First name is required!").trim(),
    check("lastName").notEmpty().withMessage("Last name is required!").trim(),
    check('email').trim().custom( async (value)=> {
        const user = await User.findOne({email: value})
        if(user) throw new Error("Email already use!")
    }),
    check("phone").trim().isLength({min: 11}).withMessage("").notEmpty().withMessage("Phone number is required!").custom(async (value)=> {
        const user = await User.findOne({phone: value});
        if(user) throw new Error ("Phone number already exits!")
    }),
    check("password").isLength({min: 6}).withMessage("Password is required!").withMessage("Password must be at least 6 chars long")
]

exports.isRequestValidated = (req,res,next) => {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped()
    if(Object.keys(mappedErrors).length === 0) {
        next()
    }else{
        res.status(500).json({
            errors: mappedErrors
        })
    }
}