const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter Your Name"],
        maxLength:[30,"Name can't exceed 30 char long"],
        minLength:[4, "Name should more than 4 char"]
    },
    email:{
        type:String,
        required:[true,"Please Enter Your email"],
        unique:true,
        validate:[validator.isEmail,"Please Enter a valid Email"]
    },
    password:{
        type:String,
        required:[true,"Please Enter Your password"],
        minLength:[8, "Password should be 8 char long"],
        select:false
    },
    avatar:{
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
    },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken:String, 
    resetPasswordExpire:Date,

});

//Encryption

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

//JWT token

userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
        
    });
};

//compare password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

//Generating password reset token

userSchema.methods.getResetPasswordToken = function(){
  //Generating token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hashing and adding resetPasswordtoken to userSchema
  this.resetPasswordToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hax");

  this.resetPasswordExpire = Date.now()+15*60*1000;
  
  return resetToken;

}


module.exports = mongoose.model("User", userSchema);