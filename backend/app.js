const express = require("express");
const bodyParser = require("body-parser");
const errorMiddleware = require("./middleware/error")
const app = express();
const cookieParser = require("cookie-parser");

app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());
// app.use(bodyParser.urlencoded({ extended: true }));


//Route Imports
const product = require("./Routes/productRoute");
const user = require("./Routes/userRoute");
const order = require("./Routes/orderRoute")
 
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order);

//Middleware for Error Handling
app.use(errorMiddleware)




module.exports = app;



