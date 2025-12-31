import { desc } from "framer-motion/client";
import mongoose from "mongoose";

const internschema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Intern title is required"]
    },
    skills_required:{
        type:String,
        required:[true,"Skills required for the intern is required"]
    },
    location:{
        type:String,
        required:[true,"Location is required"]
    },
    seats:{
        type:Number,
        default:1
    },
    applicant_count:{
        type:Number,
        default:0
    },
    stipend:{
        type:Number,
        required:[true,"Stipend is required"]
    },
    duration_in_months:{
        type:Number,
        required:[true,"Duration is required"]
    },
    status:{
        type:String,
        enum:["open","closed","paused"],
        default:"open"
    },
    posted_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"Posted by is required"]
    },
    short_description:{
        type:String,
        required:[true,"Short description is required"],
        maxlength:[ 200,"Short description cannot exceed 200 characters"]
    },
    description_link:{
        type:String,
        required:[true,"Description file is required"]
    },
    start_date:{
        type:Date,
        required:[true,"Start date is required"]
    },
    applied_users:[
        {
                    applied:{
                        type:mongoose.Schema.Types.ObjectId,
                        ref:"User"
                    },
                    status:{
                        type:String,
                        enum:["pending","rejected","accepted"],
                        default:"pending"
                    }
                }
    ],
    bookmarked_users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
},{timestamps:true});
export const Internmodel=mongoose.model("Internmodel",internschema);