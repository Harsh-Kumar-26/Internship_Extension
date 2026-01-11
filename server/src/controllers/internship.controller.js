import { asynchandler } from "../utils/asynchandler.js";

const getinternfrominternid=asynchandler(async(req,res)=>{
    const {internid}=req.params;//important
    const intern=await Internmodel.findById(internid);
    if(!intern){
        throw new ApiError(404,"Internship not found");
    }
    return res.status(200).json(new ApiResponse(200,intern,"Internship fetched successfully"));
});

export {getinternfrominternid};