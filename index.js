const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan")
require("dotenv").config();
const authRouter = require("./routes/admin/auth/User")
// Make an app
const app = express();

// database connect
mongoose.connect(process.env.DATABASE).then(()=> {
    console.log("Database connected!");
}).catch((error)=> {
    console.log("Database Error--->",error)
})

// Middleware
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(morgan('tiny'))
app.use(bodyParser.json());
app.get("/", (req, res, next) => {
    res.status(200).json("Everything is fine")
});
app.use("/api/admin", authRouter)
// 404 Error
app.use((req, res, next) => {
    next("Request URL not found!")
});
// unwanted Error
app.use((error, req, res, next) => {
    if (error) {
        res.status(500).send(error);
    } else {
        res.status(500).send("There was an Error!");
    }
});

// Listen port in this here.
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
