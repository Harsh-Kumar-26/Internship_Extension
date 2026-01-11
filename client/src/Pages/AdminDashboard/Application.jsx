import axios from "axios";
import { useState } from "react";

export default function Application(id) {
    const [applications,setApplications]=useState([]);

    const applied=[];   


async function applications() {
    try {
       const res = await axios.get(`http://localhost:8000/api/v1/admin/internshipscored`,{withCredentials:true});
       
      const applicationdata= res.data;
      applied= applicationdata.filter((appl)=>{
         if(appl._id==id){
            return appl;
         }
      })

      setApplications(applied);


    } catch (error) {
        console.log(error);
        
    }
}



async function accept(userid) {
     try {
        axios.post("http://localhost:8000/api/v1/admin/acceptapplication",{
            id,userid
        },{withCredentials:true})
    } catch (error) {
        console.log(error);
        
    }
}



async function reject(userid) {
    try {
        axios.post("http://localhost:8000/api/v1/admin/rejectapplication",{
            id,userid
        },{withCredentials:true})
    } catch (error) {
        console.log(error);
        
    }
}


async function bookmarkuser(userid) {
    try {
        axios.post("http://localhost:8000/api/v1/admin/bookmarkuser",{
            id,userid
        },{withCredentials:true})
    } catch (error) {
        console.log(error);
        
    }
}


}