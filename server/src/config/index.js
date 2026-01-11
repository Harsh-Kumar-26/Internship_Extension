import mongoose from "mongoose";
import {DB_NAME} from "../Constants.js";

const connectDB= async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${"mongodb+srv://harshkumar010377:QcfISNRsiXcVbmxq@cluster0.1ckjz5z.mongodb.net"}/${DB_NAME}`);
        
    }
    catch(err){
        console.error("MongoDB connection error  "+err);
        
        
        process.exit(1);
    }
}
export default connectDB