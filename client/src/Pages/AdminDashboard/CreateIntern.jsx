import axios from "axios";
import { useState } from "react"

export default function createintern(params) {
const [title ,settitle] = useState("");
const [skills_required,setskills]=useState([]);
const [location,setLocation]=useState("");
const [seats,setSeats] = useState(0);
const [stipend,setStipend]=useState(0)
const [duration,setDuration]=useState();
const [description,setDescription]=useState("")   
const [link,setLink]=useState();
const [date,setDate]=useState();

async function create(params) {
    
    try {
        axios.post("http://localhost:8000/api/v1/admin/createintern",{
            title,
            skills_required,
            seats,
            stipend,
            duration,
            description,
            description_link:link,
            duration_in_months:duration,
            location,
            date

        },{withCredentials:true});
        

    } catch (error) {
         console.log(error);
         
    }

}

async function edit(id) {
    try {
          axios.post(`http://localhost:8000/api/v1/admin/editintern/${id}`,{
            title,
            skills_required,
            seats,
            stipend,
            duration,
            description,
            description_link:link,
            duration_in_months:duration,
            location,
            date

        },{withCredentials:true});
    } catch (error) {
        console.log(error);
        
    }
}


async function deleteintern(id) {
    try {
         axios.post(`http://localhost:8000/api/v1/admin/editintern/${id}`,{withCredentials:true});
    } catch (error) {
        console.log(error);
        
    }
}


async function statuschange(status) {

    try {
        axios.post("http://localhost:8000/internstatuschange")
    } catch (error) {
        
    }


}


    return(<>


   



    </>)
}

