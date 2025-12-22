import mongoose from "mongoose";
import {DB_NAME} from "../Constants.js";

const connectDB= async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        
    }
    catch(err){
        console.error("MongoDB connection error  "+err);
        
        
        process.exit(1);
    }
}
export default connectDB