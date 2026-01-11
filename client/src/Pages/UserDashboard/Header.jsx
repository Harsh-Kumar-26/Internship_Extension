import { LogOut, Bell, Settings } from "lucide-react"

export default function DashboardHeader({ username }) {
  return (
    <div className="dashboard-header">
      <div className="header-left">
        <div className="user-greeting">
          <h1 className="username">Welcome, {username}</h1>
          <p className="user-subtitle">Here are your internship opportunities</p>
        </div>
      </div>

      <div className="header-right">
        <button className="header-icon-btn" aria-label="Settings">
          <Settings size={20} />
        </button>
     
      </div>
    </div>
  )
}
