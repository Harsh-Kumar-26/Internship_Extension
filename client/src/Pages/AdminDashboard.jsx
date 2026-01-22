"use client"

import { useState } from "react"
import { LayoutDashboard, BookmarkIcon, CheckCircle, Menu, X,Moon } from "lucide-react"
import DashboardHeader from "./UserDashboard/Header"
import AdminSidebar from "./AdminDashboard/SideBar"
import "../Pages/style/dashboard.css"
import axios from "axios"
import { Outlet } from "react-router"
import { useEffect } from "react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("apply")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [username,setUsername] = useState("Unknown") 


  async function getUser(params) {
    
    try {
    const res = await  axios.get("http://localhost:8000/api/v1/common/currentuser",{withCredentials:true});
       
      setUsername(res.data.data.fullname);

    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(()=>{
      getUser();
  },[])

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <AdminSidebar
    
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Header with Mobile Toggle */}
        <div className="dashboard-header-wrapper">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-white"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <DashboardHeader username={username} />
        </div>

        {/* Content Area */}
        <div className="dashboard-content"><Outlet/></div>
      </div>
    </div>
  )
}
