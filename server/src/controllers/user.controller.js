// How it works
// 1. Interships added, users apply
// 2. Admin gets to see the currently best users for them
// 3. Admin either accept the user or waits until one with even better score applies
// 4. Once accepted, user gets notified and internship is marked filled

import { asynchandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/apierror.js"
import User from "../models/user.model.js";
import { Internmodel } from "../models/intern.model.js";
import ApiResponse from "../utils/apiresponse.js";
import jwt from "jsonwebtoken";
import axios from "axios";



const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found while generating tokens");
    }

    const accesstoken = user.generateAccessToken();
    const refreshtoken = user.generateRefreshToken();
    
    

    if (!accesstoken || !refreshtoken) {
      throw new Error("Token generation failed");
    }

    user.refreshtoken = refreshtoken;
    await user.save({ validateBeforeSave: false });

    return { accesstoken, refreshtoken };
  } catch (error) {
    console.error("TOKEN GENERATION ERROR:", error);
    throw error; 
  }
};

const registeruser = asynchandler(async (req, res, next) => {
  const {
    fullname,
    email,
    password,
    gender,
    date_of_birth,
    portfolio_link,
    cntry_code,
    phone_number,
    skills, location, rural,
    resume, tribal, role
  } = req.body;

  if ([fullname, email, password, gender, date_of_birth, cntry_code, phone_number].some(field => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }


  if(!role){
    role="user";
  }
  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new ApiError(400, "Password must include a special character");
  }

  const existuser = await User.findOne({
    $or: [{ phone_number }, { email }],
  });

  if (existuser) {
    throw new ApiError(409, "Phone number or email already registered");
  }

  const user = await User.create({
    fullname,
    email,
    password,
    gender,
    date_of_birth,
    portfolio_link,
    cntry_code,
    phone_number,
    skills, location, rural,
    resume, tribal, role
  });



  const createduser = await User.findById(user._id).select("-password -refreshToken");

  if (!createduser) {
    throw new ApiError(500, "Something went wrong while signing up");
  }

  return res.status(201).json(
    new ApiResponse(200, createduser, "User registered successfully")
  );
});

const loginuser=asynchandler(async(req,res)=>{
    const {email,password}=req.body;
    if(!email){
        throw new ApiError(400,"Email is required")
    }
    const user=await User.findOne({
        email
    })
    if(!user){
        throw new ApiError(400,"User does not exist");
    }
    const correctpassword=await user.isPasswordCorrect(password);
    if(!correctpassword){
        throw new ApiError(401,"Incorrect password");
    }
    const {accesstoken,refreshtoken}=await generateAccessAndRefreshToken(user._id);
    console.log("tokens",accesstoken,refreshtoken);
    
    const loggedinuser=await User.findById(user._id).select("-password -refreshtoken");
const options = {
  httpOnly: true,
  secure: false,     // MUST be false on localhost
  sameSite: "Lax",   // works for localhost
};

    return res.status(200).cookie("accesstoken",accesstoken,options).cookie("refreshtoken",refreshtoken,options)
    .json(
        new ApiResponse(200,{
                user:loggedinuser,
                accesstoken:accesstoken,
                refreshtoken:refreshtoken
            },
        "User logged in succesfully")
    )
})
const logoutuser = asynchandler(async (req, res) => {
    console.log("USER:", req.user);

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: "" },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  };

  return res
    .status(200)
    .clearCookie("accesstoken", options)
    .clearCookie("refreshtoken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});


const refreshaccesstoken=asynchandler(async(req,res)=>{
    const incomingrefreshToken= req.cookies.refreshtoken || req.body.refreshtoken;
    if(!incomingrefreshToken){
        throw new ApiError(401,"Unauthorized request");
    }
    try {
        const decodedtoken=jwt.verify(
        incomingrefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        const user=await User.findById(decodedtoken?._id);
        if(!user){
            throw new ApiError(401,"Unauthorized request");
        }
        if(incomingrefreshToken!== user?.refreshtoken){
            throw new ApiError(401,"Invalid refresh token");
        }
        const options={
            httpOnly:true,
            secure:true,
            sameSite: "None"
        }
    
       const{accesstoken,refreshtoken}=await generateaccessandrefreshtoken(user._id);
       return res.status(200).cookie("accessToken",accesstoken,options).cookie("refreshtoken",refreshtoken,options)
       .json(new ApiResponse(200,{accesstoken,refreshtoken},"Access Token refreshed"));
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh token");
    }
})
const getcurrentuser=asynchandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200,req.user,"Current user fetched ssuccessfully"));
})
const getuserfromid=asynchandler(async(req,res)=>{
    const {id}=req.params;
    const user = await User.findById(id).select("-password -refreshToken");
    if(!user){
        throw new ApiError(404,"User not found");
    }
    return res.status(200).json(new ApiResponse(200,user,"user data fetched successfully"));
})

const editprofile=asynchandler(async(req,res)=>{
    const userid=req.user._id;
    let {fullname,gender,date_of_birth,portfolio_link,cntry_code,phone_number,skills,location,oldpassword,newpassword,rural, resume, tribal}=req.body;
    const olduser=await User.findById(userid);
    if(fullname==undefined){
        fullname=olduser.fullname;
    }

    if(gender==undefined){
        gender=olduser.gender;
    }
    if(skills==undefined){
        skills=olduser.skills;
    }
    if(date_of_birth==undefined){
        date_of_birth=olduser.date_of_birth;
    }
    if(portfolio_link==undefined){
        portfolio_link=olduser.portfolio_link;
    }
    if(cntry_code==undefined){
        cntry_code=olduser.cntry_code;
    }
    if(phone_number==undefined){
        phone_number=olduser.phone_number;
    }
    if(rural==undefined){
        rural=olduser.rural;
    }
    if(resume==undefined){
        resume=olduser.resume;
    }
    if(tribal==undefined){
        tribal=olduser.tribal;
    }
    if(location==undefined){
        location=olduser.location;
    }

let user=await User.findByIdAndUpdate(req.user?._id,{
    $set:{
        fullname,
        gender,
        date_of_birth,
        portfolio_link,
        skills,
        location,
        cntry_code,
        phone_number,
        rural,
        resume,
        tribal
    }
},{new: true}).select("-password");
if(oldpassword && newpassword){
    if(newpassword.length<8){
        throw new ApiError(409,"Password length should be atleast 8 charachter");
    }
    
    const correctpassword=await olduser.isPasswordCorrect(oldpassword);
    if(!(correctpassword)){
        throw new ApiError(400,"Wrong old password entered");
    }
    olduser.password=newpassword;
    await olduser.save({validateBeforeSave:false});
}
    return res.status(200).json(new ApiResponse(200,user,"Success in changing user profile"));
});

const applyforinter=asynchandler(async(req,res)=>{
    const userid=req.user._id;
    const {internid}=req.body;
    const user=await User.findById(userid);
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const intern=await Internmodel.findById(internid);
    if(!intern){
        throw new ApiError(404,"Intern not found");
    }
    const alreadyapplied=intern.applied_users.some(user=>user.applied.equals(userid));
    if(alreadyapplied){
        throw new ApiError(409,"Already applied for this intern");
    }
    if(intern.applicant_count>=intern.seats){
        throw new ApiError(409,"No seats available for this intern");
    }
    intern.applicant_count++;
    intern.applied_users.push({applied:userid});
    await intern.save({validateBeforeSave:false});
    user.applied_internships.push({applied:internid});
    await user.save({validateBeforeSave:false});
    return res.status(200).json(new ApiResponse(200,{},"Successfully applied for the intern"));
});



const removefromintern=asynchandler(async(req,res)=>{
    const userid=req.user._id;
    const {internid}=req.body;
    const user=await User.findById(userid);
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const intern=await Internmodel.findById(internid);
    if(!intern){
        throw new ApiError(404,"Intern not found");
    }
    const applied=intern.applied_users.some(user=>user.applied.equals(userid));
    if(!applied){
        throw new ApiError(409,"Not applied for this intern");
    }
    if(user.applied_internships.find(intern=>intern.applied.equals(internid)).status!=="pending"){
        throw new ApiError(409,"Cannot remove since application already processed");
    }
    intern.applied_users=intern.applied_users.filter(user=>!user.applied.equals(userid));
    intern.applicant_count--;
    await intern.save({validateBeforeSave:false});
    user.applied_internships=user.applied_internships.filter(user=>!user.applied.equals(internid));
    await user.save({validateBeforeSave:false});
    return res.status(200).json(new ApiResponse(200,{},"Successfully removed from the intern"));

});
const bookmarked_internships=asynchandler(async(req,res)=>{
    const userid=req.user._id;
    const {internid}=req.body;
    const user=await User.findById(userid);
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const intern=await Internmodel.findById(internid);
    if(!intern){
        throw new ApiError(404,"Intern not found");
    }
    const alreadybookmarked=user.bookmarked_internships.some(intern=>intern.equals(internid));
    if(alreadybookmarked){
        throw new ApiError(409,"Already bookmarked this intern");
    }
    user.bookmarked_internships.push(internid);
    await user.save({validateBeforeSave:false});
    return res.status(200).json(new ApiResponse(200,{},"Successfully bookmarked the intern"));
});
const remove_bookmarked_internship=asynchandler(async(req,res)=>{
    const userid=req.user._id;
    const {internid}=req.body;
    const user=await User.findById(userid);
    if(!user){
        throw new ApiError(404,"User not found");
    }   
    const intern=await Internmodel.findById(internid);
    if(!intern){
        throw new ApiError(404,"Intern not found");
    }
    const alreadybookmarked=user.bookmarked_internships.some(intern=>intern.equals(internid));
    if(!alreadybookmarked){
        throw new ApiError(409,"Intern not bookmarked");
    }
    user.bookmarked_internships=user.bookmarked_internships.filter(intern=>!intern.equals(internid));
    await user.save({validateBeforeSave:false});
    return res.status(200).json(new ApiResponse(200,{},"Successfully removed bookmarked intern"));
});
const allapplied_internships=asynchandler(async(req,res)=>{
    const userid=req.user._id;
    const user=await User.findById(userid);
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const appliedintern=user.applied_internships.map(async(intern)=>{
        const interndata=await Internmodel.findById(intern.applied);
        return {
            intern:interndata,
            status:intern.status
        };
    });
    const allinterns=await Promise.all(appliedintern); // important
    return res.status(200).json(new ApiResponse(200,allinterns,"All applied internships fetched successfully"));
});

const allbookmarked_internships=asynchandler(async(req,res)=>{
    const userid=req.user._id;
    const user=await User.findById(userid);
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const bookmarkedintern=user.bookmarked_internships.map(async(internid)=>{
        const interndata=await Internmodel.findById(internid);
        return interndata;
    });
    const allinterns=await Promise.all(bookmarkedintern);
    return res.status(200).json(new ApiResponse(200,allinterns,"All bookmarked internships fetched successfully"));
});

const allinternswithseats = asynchandler(async (req, res) => {
  const interns = await Internmodel.find({
    $expr: { $lt: ["$applicant_count", "$seats"] } // very important
  });

  return res
    .status(200)
    .json(new ApiResponse(200, interns, "All internships fetched successfully"));
});

// doubt
const singleuserintern =asynchandler(async(req,res)=>{
    const userid=req.user._id;
    const {internid}=req.params;
    const user=await User.findById(userid);
    if(!user){
        throw new ApiError(404,"User not found");
    }
    const intern=await Internmodel.findById(internid);
    if(!intern){
        throw new ApiError(404,"Intern not found");
    }
    const inputdata={
        "users":[
            {
                "user_id":userid,
                "skills":user.skills,
                "location":user.location,
                "rural":user.rural,
                "tribal":user.tribal,
                "applied_internships":[internid]
            }
        ],
        "internships":[
            {
                "internship_id":internid,
                "title":intern.title,
                "description":intern.skills_required,
                "location":intern.location,
                "capacity":(intern.seats - intern.applicant_count)
            }
        ]
    }
    let response;
    // console.log(`${process.env.SIH_PREDICTION_API}allocate`);
    
    try{
    response=await axios.post(`${process.env.SIH_PREDICTION_API}allocate`,inputdata);
    }
    catch(error){
        throw new ApiError(500,error);
    }
    const score=response.data[0]?.score || 0;
    if(score>=0.45){
        response.data[0].recommendation="Recommended";
    }
    else{
        response.data[0].recommendation="Not Recommended";
    }

    return res.status(200).json(new ApiResponse(200,response.data[0],"Internship score fetched successfully"));
});



export {registeruser,loginuser,logoutuser,refreshaccesstoken,getcurrentuser,editprofile,getuserfromid,applyforinter,removefromintern,bookmarked_internships,remove_bookmarked_internship,allapplied_internships,allbookmarked_internships,allinternswithseats,singleuserintern};