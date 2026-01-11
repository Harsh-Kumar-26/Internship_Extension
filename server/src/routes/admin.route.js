import { Router } from "express";
import { createintern,getadminallinterns,bookmarkuser,internshipscored,internstatuschange,editintern,deleteintern,acceptapplication,rejectapplication } from "../controllers/admin.controller.js";
import { verifyJWTadmin } from "../middlewares/adminauth.middleware.js";

const adminroute=Router();

adminroute.route("/createintern").post(verifyJWTadmin,createintern);
adminroute.route("/getadminallinterns").get(verifyJWTadmin,getadminallinterns);
adminroute.route("/editintern/:internid").put(verifyJWTadmin,editintern);
adminroute.route("/deleteintern/:internid").delete(verifyJWTadmin,deleteintern);
adminroute.route("/acceptapplication").post(verifyJWTadmin,acceptapplication);
adminroute.route("/rejectapplication").post(verifyJWTadmin,rejectapplication);
adminroute.route("/internstatuschange/:internid").post(verifyJWTadmin,internstatuschange);
adminroute.route("/bookmarkuser").post(verifyJWTadmin,bookmarkuser);
adminroute.route("/internshipscored").get(verifyJWTadmin,internshipscored);




export default adminroute;