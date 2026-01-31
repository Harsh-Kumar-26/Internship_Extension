import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userrouter from "./routes/user.route.js"
import rateLimit from "express-rate-limit";
import errorHandler from "./middlewares/error.middleware.js";
import commonrouter from "./routes/common.route.js"
import adminroute from "./routes/admin.route.js"

const app=express();

app.get("/health",(req,res)=>{
    res.status(200).send("OK");
})

app.use(cors({
    origin:"https://internship-extension-111.vercel.app" ,
    credentials:true
}));


app.use(express.json({limit: "16kb"}));
app.use(express.static("public"));  


app.use(rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests from this IP, please try again later."
}));


app.use(express.urlencoded({extended:true , limit: "16kb"}));      
app.use(cookieParser());
app.use("/api/v1/common",commonrouter);
app.use("/api/v1/user",userrouter);
app.use("/api/v1/admin",adminroute);

app.use(errorHandler);
app.use((req, res) => {
    res.status(404).json({ message: "Not Found" });
});
export default app;