const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const { restart } = require("nodemon");
const sendEmail = require("../utils/sendEmail")
//Register a User

exports.registerUser = catchAsyncError(async(req,res,next)=>{
    const {name, email, password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"this is a sample id",
            url:"profileUrl"
        }
    });

    sendToken(user,201,res);

});

exports.loginUser = catchAsyncError(async(req,res,next)=>{
    const {email, password} = req.body;
    if(!email || ! password){
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({email}).select("+password");
    //how it access password ? which is encrypted
    if(!user){
        return next(new ErrorHandler("Invalid email of password",401));
    } 

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401))
    }
    const token = user.getJWTToken();

    sendToken(user,200,res);
});

//Logout User

exports.logoutUser = catchAsyncError(async(req,res,next)=>{
    
    // console.log(res);
    res.cookie("token", null,{
        expires: new Date(Date.now()),
        httpOnly:true,
    });

    res.status(200).json({
        success:true,
        message:"Logged Out",
    });  
})

//Forgot password
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found", 404));
    }

    //Get resetPassword token

    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it`;

    try{
        await sendEmail({
            email:user.email,
            subject:`Ecommerce Password Recovery`,
            message,

        });

        res.status(200).json({
            success: true,
            message:`Email send to ${user.email} successfully`,
        })

    } catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave:false});

        return next( new ErrorHandler(error.message, 500));

    }
})