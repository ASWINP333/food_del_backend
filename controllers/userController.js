import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

//login user
const loginUser = async (req,res)=>{
    const {email,password}=req.body;
    try {
        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success:false,message:"User does not exists"});
        }
        //checking the password
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
                return res.json({success:false,message:"Password does not exists"});
        }
        //generating the token
        const token = createToken(user._id)
        res.json({success:true,token});
    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Login  error"});
    }
}

//generating the token
const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}

//register user
const registerUser = async (req,res)=>{
    const {name,email,password}=req.body;
    try {
        //checking the user is already exists
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.json({success:false,message:"user already exists"});
        }
        //validating the emain format and the strong password
        if(!validator.isEmail(email)){
            return  res.json({success:false,message:"Plaese enter valid email"});
        }
        if(password.length <8){
            return res.json({success:false,message:"Please enter a Strong password"});
        }

        //hashin the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({success:true,token})
      

    } catch (error) {
        console.log(error)
        res.json({success:false,message:"Internal server error"});
    }
}

export  {loginUser,registerUser};