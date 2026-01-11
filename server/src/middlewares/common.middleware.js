import { ApiError } from "../utils/apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyJWTcommon = async (req, res, next) => {
  console.log("COOKIES RECEIVED:", req.cookies);

  const token =
    req.cookies?.accesstoken ||
    req.cookies?.accessToken ||
    req.headers.authorization?.replace("Bearer ", "");

  console.log("TOKEN FOUND:", token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token received",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("DECODED TOKEN:", decoded);

    req.user = await User.findById(decoded._id).select("-password");
    console.log("USER FOUND:", req.user);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    next();
  } catch (err) {
    console.error("JWT VERIFY ERROR:", err);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: err.message,
    });
  }
};
