
import axios from "axios"
import { Brain, LogOut } from "lucide-react"
import { useNavigate } from "react-router";
import { LayoutDashboard, BookmarkIcon, CheckCircle, Menu, X } from "lucide-react"

export default function AdminSidebar({ activeTab, setActiveTab, isOpen }) {


  const navigate = useNavigate();

async function Logout() {
  try {
    await axios.post(
      "http://localhost:8000/api/v1/common/logout",
      {},
      {withCredentials: true}
    );
    navigate("/");
  } catch (error) {
    console.log(error.response?.data || error.message);
  }
}



  const navigationItems = [
    {
      id: "createintern",
      label: "Create Internships",
      icon: LayoutDashboard,
    },
    {
      id: "adminallintern",
      label: "Your Interns",
      icon: BookmarkIcon,
    },
 
  ]


function navclick(id,name) {
  setActiveTab(id);
  navigate(`/admindashboard/${id}`)
}



  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      {/* Logo Section */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Brain size={24} />
        </div>
        <span className="logo-text">InternMatch</span>
      </div>

      {/* Navigation Items */}
      <nav className="sidebar-nav">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navclick(item.id)}
            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            aria-current={activeTab === item.id ? "page" : undefined}
          >
            <item.icon size={20} />
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="sidebar-footer">
        <button className="logout-link" onClick={Logout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
