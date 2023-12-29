const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const User = require("../../model/User");

// Signup
exports.signup = async (req, res) => {
    try {
        const { phone, email } = req.body;
        const isExitsUser = await User.find({
            $or: [{ phone: phone, }, { email: email }],
        });
        if (isExitsUser.length < 0) {
            res.status(400).json({
                message: "User already registered!",
            });
        } else {
            const { firstName, lastName, phone, password, email } = req.body;
            const hash_password = bcrypt.hashSync(password, 10);
            const newUserObj = {
                firstName,
                lastName,
                phone,
                password: hash_password,
                email,
                userName: firstName + lastName,
                role: "admin",
            };
            const newUser = new User(newUserObj);
            newUser.save().then((data) => {
                if (data) {
                    res.status(201).json({
                        message: "User created successfully done!",
                    });
                } else {
                    res.status(400).json({
                        message: "Something went wrong!",
                    });
                }
            });
        }
    } catch (error) {
        if (error)
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
    }
};


// Signing
exports.signing = async (req, res) => {
    try {
        const { phone, email, password } = req.body;
        const exitsUser = await User.findOne({
            $or: [{ phone: phone, }, { email: email }],
        });
        if(exitsUser){
            const comparePassword = bcrypt.compareSync(password, exitsUser.password)
            if(comparePassword){
                const token = jwt.sign(
                    {
                      _id: exitsUser._id,
                      role: exitsUser.role,
                    },
                    process.env.SECRET_KEY_OF_SHOP,
                    { algorithm: 'HS256' },
                    {
                      expiresIn: "1d",
                    }
                  );
                  if(token){
                    const {_id, firstName, lastName, userName, role, email, number} = exitsUser
                    res.status(200).json({
                        token: token,
                        user: {
                            _id, userName, firstName, lastName, role, email, number
                        }
                    })
                  }
                
            }else{
                res.status(400).json({message: "Password incorrect!"})
            }
        }else{
            console.log( "else",exitsUser)
        }
    } catch (error) {
        
    }
}