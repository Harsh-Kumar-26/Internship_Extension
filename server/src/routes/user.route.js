import express from "express";
import { applyforinter,singleuserintern,allbookmarked_internships,allapplied_internships,logoutuser, removefromintern, bookmarked_internships, remove_bookmarked_internship } from "../controllers/user.controller.js";
import { verifyJWTuser } from "../middlewares/userauth.middleware.js";

const userroute=express.Router();

userroute.route("/applyforintern").post(verifyJWTuser,applyforinter);
userroute.route("/removefromintern").post(verifyJWTuser,removefromintern);
userroute.route("/bookmarked_internships").post(verifyJWTuser,bookmarked_internships);
userroute.route("/remove_bookmarked_internship").post(verifyJWTuser,remove_bookmarked_internship);
userroute.route("/allapplied_internships").get(verifyJWTuser,allapplied_internships);
userroute.route("/allbookmarked_internships").get(verifyJWTuser,allbookmarked_internships);
userroute.route("/singleuserintern/:internid").get(verifyJWTuser,singleuserintern);




export default userroute;




