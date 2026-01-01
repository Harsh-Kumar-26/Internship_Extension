import { asynchandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/apierror.js"
import User from "../models/user.model.js";
import { Internmodel } from "../models/intern.model.js";
import ApiResponse from "../utils/apiresponse.js";
import axios from "axios";
import usermodel from "../models/user.model.js";

const createintern=asynchandler(async(req,res)=>{
    const {title,skills_required,location,seats,stipend,duration_in_months,short_description,description_link,start_date}=req.body;
    const userid=req.user.id;
    if(!title || !skills_required || !location || !stipend || !duration_in_months || !short_description || !description_link || !start_date){
        throw new ApiError(400,"All fields are required");
    }
    if(seats<=0){
        throw new ApiError(400,"Seats must be greater than 0");
    }
    if(stipend<0){
        throw new ApiError(400,"Stipend cannot be negative");
    }
    if(duration_in_months<=0){
        throw new ApiError(400,"Duration must be greater than 0");
    }
    if(short_description.length>200){
        throw new ApiError(400,"Short description cannot exceed 200 characters");
    }
    if(new Date(start_date)<=new Date()){
        throw new ApiError(400,"Start date must be a future date");
    }
    const newintern=await Internmodel.create({
        title,
        skills_required,
        location,
        seats,
        stipend,
        duration_in_months,
        posted_by:userid,
        short_description,
        description_link,
        start_date
    });
    if(!newintern){
        throw new ApiError(500,"Internship creation failed");
    }
    await User.findByIdAndUpdate(userid, { $push: { createdinternships: newintern._id } });
    return res.status(201).json(new ApiResponse(201,newintern,"Internship created successfully"));
});

const editintern=asynchandler(async(req,res)=>{
    const internid=req.params.internid;
    const userid=req.user.id;
    let body=req.body;
    const intern=await Internmodel.findById(internid);
    if(!intern){
        throw new ApiError(404,"Internship not found");
    }
    if(!intern.posted_by.equals(userid)){
        throw new ApiError(403,"User not authorized to edit this internship");
    }
    if(!body.title){
        body.title=intern.title;
    }
    if(!body.skills_required){
        body.skills_required=intern.skills_required;
    }
    if(!body.location){
        body.location=intern.location;
    }
    if(!body.seats){
        body.seats=intern.seats;
    }
    if(!body.stipend){
        body.stipend=intern.stipend;
    }
    if(!body.duration_in_months){
        body.duration_in_months=intern.duration_in_months;
    }
    if(!body.short_description){
        body.short_description=intern.short_description;
    }
    if(!body.description_link){
        body.description_link=intern.description_link;
    }
    if(!body.start_date){
        body.start_date=intern.start_date;
    }
    if(body.seats<=0 || body.stipend<0 || body.duration_in_months<=0 || body.short_description.length>200 || new Date(body.start_date)<=new Date()){
        throw new ApiError(400,"Invalid input data");
    }
    const updatedintern=await Internmodel.findByIdAndUpdate(internid,body,{new:true});
    if(!updatedintern){
        throw new ApiError(500,"Internship update failed");
    }
    return res.status(200).json(new ApiResponse(200,updatedintern,"Internship updated successfully"));
});


const deleteintern=asynchandler(async(req,res)=>{
    const internid=req.params.internid;
    const userid=req.user.id;
    const intern=await Internmodel.findById(internid);
    if(!intern){
        throw new ApiError(404,"Internship not found");
    }
    if(!intern.posted_by.equals(userid)){
        throw new ApiError(403,"User not authorized to delete this internship");
    }
    await Internmodel.findByIdAndDelete(internid);
    return res.status(200).json(new ApiResponse(200,null,"Internship deleted successfully"));
});

const adminallinterns=asynchandler(async(req,res)=>{
    const adminid=req.user.id;
    const adminuser=await User.findById(adminid);
    const interns=adminuser.createdinternships.map(async(internid)=>{
        const intern=await Internmodel.findById(internid);
        return intern;
    });
    const resolvedinterns=await Promise.all(interns);
    return res.status(200).json(new ApiResponse(200,resolvedinterns,"All internships fetched successfully"));
});


const acceptapplication=asynchandler(async(req,res)=>{
    const {internid,userid}=req.body;
    if(!internid || !userid){
        throw new ApiError(400,"Internship ID and User ID are required");
    }
    const adminid=req.user.id;
    const adminuser=await User.findById(adminid);
    if(!adminuser.createdinternships.includes(internid)){
        throw new ApiError(403,"User not authorized to accept applications for this internship");
    }
    const intern=await Internmodel.findById(internid);
    if(!intern){
        throw new ApiError(404,"Internship not found");
    }
    const application=intern.applied_users.find(app=>app.applied.equals(userid));
    if(!application){
        throw new ApiError(404,"Application not found");
    }
    if(application.status==="accepted"){
        throw new ApiError(409,"Application already accepted");
    }
    if( application.status==="rejected"){
        throw new ApiError(409,"Application already rejected");
    }
    if(intern.accepted_students>=intern.seats){
        throw new ApiError(409,"All seats for this internship have been filled");
    }
    application.status="accepted";
    intern.accepted_students+=1;
    if(intern.accepted_students===intern.seats){
        intern.status="closed";
    }
    await intern.save({validateBeforeSave:false});
    const user=await User.findById(userid);
    const userapplication=user.applied_internships.find(app=>app.applied.equals(internid));
    userapplication.status="accepted";
    await user.save({validateBeforeSave:false});
    return res.status(200).json(new ApiResponse(200,null,"Application accepted successfully"));
});



const rejectapplication=asynchandler(async(req,res)=>{
    const {internid,userid}=req.body;
    if(!internid || !userid){
        throw new ApiError(400,"Internship ID and User ID are required");
    }
    const adminid=req.user.id;
    const adminuser=await User.findById(adminid);
    if(!adminuser.createdinternships.includes(internid)){
        throw new ApiError(403,"User not authorized to accept applications for this internship");
    }
    const intern=await Internmodel.findById(internid);
    if(!intern){
        throw new ApiError(404,"Internship not found");
    }
    const application=intern.applied_users.find(app=>app.applied.equals(userid));
    if(!application){
        throw new ApiError(404,"Application not found");
    }
    if(application.status==="accepted"){
        throw new ApiError(409,"Application already accepted");
    }
    if( application.status==="rejected"){
        throw new ApiError(409,"Application already rejected");
    }
    application.status="rejected";
    await intern.save({validateBeforeSave:false});
    const user=await User.findById(userid);
    const userapplication=user.applied_internships.find(app=>app.applied.equals(internid));
    userapplication.status="rejected";
    await user.save({validateBeforeSave:false});
    return res.status(200).json(new ApiResponse(200,null,"Application rejected successfully"));
});

const internstatuschange=asynchandler(async(req,res)=>{
    const internid=req.params.internid;
    const {status}=req.body;
    const adminid=req.user.id;
    const adminuser=await User.findById(adminid);
    if(!status || !["open","closed","paused"].includes(status)){
        throw new ApiError(400,"Valid status is required");
    }
    if(!adminuser.createdinternships.includes(internid)){
        throw new ApiError(403,"User not authorized to change status for this internship");
    }
    const intern=await Internmodel.findById(internid);
    if(!intern){
        throw new ApiError(404,"Internship not found");
    }
    if(intern.status==="closed" && status==="open"){
        if(intern.accepted_students>=intern.seats){
            throw new ApiError(409,"All seats for this internship have been filled");
        }
    }
    intern.status=status;
    await intern.save({validateBeforeSave:false});
    return res.status(200).json(new ApiResponse(200,null,"Internship status changed successfully"));
});

const bookmarkuser=asynchandler(async(req,res)=>{
    const {internid,userid}=req.body;
    const adminid=req.user.id;
    const adminuser=await User.findById(adminid);
    if(!adminuser.createdinternships.includes(internid)){
        throw new ApiError(403,"User not authorized to bookmark users for this internship");
    }
    const intern=await Internmodel.findById(internid);
    if(!intern.bookmarked_users.includes(userid)){
        intern.bookmarked_users.push(userid);
    }else{
        intern.bookmarked_users.pull(userid);
    }
    await intern.save({validateBeforeSave:false});
    return res.status(200).json(new ApiResponse(200,null,"User bookmarked/unbookmarked successfully"));
});

const getadminallinterns=asynchandler(async(req,res)=>{
    const adminid=req.user.id;
    const adminuser=await User.findById(adminid);
    const interns=adminuser.createdinternships.map(async(internid)=>{
        const intern=await Internmodel.findById(internid);
        return intern;
    });
    const resolvedinterns=await Promise.all(interns);
    return res.status(200).json(new ApiResponse(200,resolvedinterns,"All internships fetched successfully"));
});

const internshipscored=asynchandler(async(req,res)=>{
    const users = await usermodel.aggregate([
  {
    $match: { role: "user" }
  },
  {
    $project: {
      _id: 0,
      user_id: "$_id",
      skills: 1,
      location: 1,
      rural: 1,
      tribal: 1,
      applied_internships: {
        $map: {
          input: {
            $filter: {
              input: "$applied_internships",
              as: "app",
              cond: { $eq: ["$$app.status", "pending"] }
            }
          },
          as: "pendingApp",
          in: "$$pendingApp.applied"
        }
      }
    }
  }
]);

    const internships = await Internmodel.aggregate([
  {
    $project: {
      _id: 0,
      internship_id: "$_id",
      title: 1,
      description: "$skills_required",
      location: 1,
      capacity: "$seats"
    }
  }
]);

const inputData = { users, internships };

    const response = await axios.post(`${process.env.SIH_PREDICTION_API}allocate`, inputData);
    const scoredData = response.data;

    return res.status(200).json(new ApiResponse(200, scoredData, "Internship scoring completed successfully"));


});


export {createintern,editintern,getadminallinterns,deleteintern,adminallinterns,acceptapplication,rejectapplication,internstatuschange,bookmarkuser,internshipscored};
