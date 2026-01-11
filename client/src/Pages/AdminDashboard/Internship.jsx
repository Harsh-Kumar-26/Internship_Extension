import axios from "axios";
import { useState } from "react";

export default function Internship(id) {
    const [intern,setIntern]=useState();

async function getIntern() {
    

try {
    const res = await axios.get(`http://localhost:8000/api/v1/common/getintern/${id}`,{withCredentials:true});

     setIntern(res.data);

} catch (error) {
    console.log(error);
    
}


}



}