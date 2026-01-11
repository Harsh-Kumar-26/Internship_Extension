"use client"

import { useState } from "react"
import { LayoutDashboard, BookmarkIcon, CheckCircle, Menu, X } from "lucide-react"
import DashboardHeader from "./UserDashboard/Header"
import Sidebar from "./UserDashboard/Sidebar"
import ApplyInternships from "./UserDashboard/Applyinternship"
import BookmarkedInternships from "./UserDashboard/Bookmarkedinternship"
import AppliedInternships from "./UserDashboard/Appliedinternship"
import "../Pages/style/dashboard.css"
import axios from "axios"
import { Outlet } from "react-router"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("apply")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [username] = useState("Sarah Anderson") 






  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar
    
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
            className="mobile-toggle-btn"
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
