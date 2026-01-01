import { Router } from "express";
import { registeruser ,loginuser,logoutuser, refreshaccesstoken,getcurrentuser,getuserfromid,editprofile} from "../controllers/user.controller.js";
import { verifyJWTcommon } from "../middlewares/common.middleware.js";
import { getinternfrominternid } from "../controllers/internship.controller.js";
const common=Router();


common.route("/signup").post(registeruser);
common.route("/login").post(loginuser);
common.route("/logout").post(verifyJWTcommon,logoutuser);
common.route("/refreshaccesstoken").post(refreshaccesstoken);
common.route("/currentuser").get(verifyJWTcommon,getcurrentuser);
common.route("/getuser/:id").get(verifyJWTcommon,getuserfromid);
common.route("/editprofile").put(verifyJWTcommon,editprofile);
common.route("/getintern/:internid").get(verifyJWTcommon,getinternfrominternid);


export default common;
