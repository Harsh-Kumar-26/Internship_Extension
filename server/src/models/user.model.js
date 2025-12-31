import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userschema=new mongoose.Schema({
    fullname:{
        type:String,
        required:[true,"Full Name is required"],
        trim:true
    },
    gender:{
        type:String,
        enum:["Male","Female","Prefer not to say"],
        required:[true,"Gender is required"]
    },
    date_of_birth:{
        type:Date,
        required:[true,"Date of Birth is required"]
    },
    portfolio_link:{
        type:String,
        default:"No portfolio site"
    },
    cntry_code:{
        type:String,
        default:"+91"
    },
    phone_number:{
        type:String,
        validate:{
            validator:function(val){
                return /^\d{10}$/.test(val);
            },
            message:"Phone number must be 10 digits"
        }
    },
    skills:{
        type:String,
    },
    location:{
        type:String
    },
    rural:{
        type:Number
    },
    applied_internships:[
        {
            applied:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Internmodel"
            },
            status:{
                type:String,
                enum:["pending","rejected","accepted"],
                default:"pending"
            }
        }
    ],
    resume:{
        type:String,
        default:"No resume provided"
    },
    tribal:{
        type:Number
    },
    email:{
        type:String,
        required:[true,"Email id is required"],
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minlength:[8,"Password should atleast be 8 characters long"],
        validate: {
    validator: function (val) {
      return /[!@#$%^&*(),.?":{}|<>]/.test(val);
    },
    message: "Password must contain at least one special character"
    }
},
    refreshtoken:{
        type:String
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    bookmarked_internships:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Internmodel",
        default:[]
    },
    bookmarked_users:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Usermodel"
            },
            internship:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Internmodel"
            }
        }
    ]
},{timestamps:true});

userschema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,9);
    }
    next();
});


userschema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password)
}

userschema.methods.generateaccesstoken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userschema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

const usermodel=mongoose.model("User",userschema);

export default usermodel;