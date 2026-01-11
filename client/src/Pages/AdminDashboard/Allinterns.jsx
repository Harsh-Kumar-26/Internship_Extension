import axios from "axios";
import { useState } from "react";

export default function interns(params) {
    const [interns,setInterns]=useState([]);


async function getAllInterns(params) {
    
try {
   const res = await  axios.get("http://localhost:8000/api/v1/admin/getadminallinterns",{withCredentials:true});

    setInterns(res.data);


} catch (error) {
    console.log(error);
    
}

}



}