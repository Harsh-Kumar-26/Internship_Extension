import { isDragActive } from "framer-motion";
import { LogOut, Bell, Settings ,Moon} from "lucide-react"
import { useEffect, useState } from "react"

export default function DashboardHeader({ username }) {
 const [isDark,setDark]=useState(false);


async function toogleDark(params) {
  setDark(!isDark)
}

 useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');// important hai hai 
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);
  return (
    <div className="dashboard-header">
      <div className="header-left">
        <div className="user-greeting">
          <h1 className="username">Welcome, {username}</h1>
<button className="w-5 h-5" onClick={toogleDark}><Moon/></button>
      
        </div>
      </div>

      <div className="header-right">
   
     
      </div>
    </div>
  )
}
