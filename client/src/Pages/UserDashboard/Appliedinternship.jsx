import { CheckCircle, MapPin, Briefcase, Clock } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";


const mockApplied = [
  {
    id: 1,
    company: "Google",
    position: "Software Engineer Intern",
    location: "Mountain View, CA",
    appliedDate: "2024-01-15",
    status: "reviewing",
    matchScore: 94,
    logo: "🔍",
  },
  {
    id: 2,
    company: "Meta",
    position: "Product Manager Intern",
    location: "Menlo Park, CA",
    appliedDate: "2024-01-10",
    status: "interview",
    matchScore: 87,
    logo: "f",
  },
  {
    id: 4,
    company: "Amazon",
    position: "Data Science Intern",
    location: "Seattle, WA",
    appliedDate: "2024-01-08",
    status: "accepted",
    matchScore: 85,
    logo: "📦",
  },
]

const getStatusBadge = (status) => {
  const statusConfig = {
    pending: { label: "Pending", color: "status-reviewing" },
    accepted: { label: "Accepted", color: "status-accepted" },
    rejected: { label: "Not Selected", color: "status-rejected" },
  }
  return statusConfig[status] || { label: "Pending", color: "status-pending" }
}





export default function AppliedInternships() {


const [interns, setInterns] = useState([])

  async function getapplied_Internship() {
    try {
      const res = await axios.get("allapplied_internships", { withCredentials: true })
      setInterns(res.data.interns || [])
    } catch (error) {
      console.log(error)
    }
  }

  async function remove(params) {
    
    try {
      axios.post("http://localhost:8000/removefromintern",{},{withCredentials:true})
      getapplied_Internship();
    } catch (error) {
        console.log(error);
        
    }
  }


  useEffect(()=>{

   getapplied_Internship()

  },[])


  return (
    <div className="feature-page">
      <div className="page-header">
        <h2 className="page-title">My Applications</h2>
        <p className="page-subtitle">Track your application status</p>
      </div>

      {mockApplied.length === 0 ? (
        <div className="empty-state">
          <CheckCircle size={48} />
          <h3>No Applications Yet</h3>
          <p>Start applying to internships to see them here</p>
        </div>
      ) : (
        <div className="applied-list">
          {interns.map((application) => {
            const statusBadge = getStatusBadge(application.status)
            return (
              <div key={application.intern._id} className="application-item">
                <div className="app-header">
                  <div className="app-company-info">
                   
                    <div>
                      <h3 className="app-company">{application.intern.title}</h3>
                      <p className="app-position">{application.intern.accepted_students}</p>
                    </div>
                  </div>
                  <span className={`status-badge ${statusBadge.color}`}>{statusBadge.label}</span>
                </div>

                <div className="app-details">
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span>{application.intern.location}</span>
                  </div>
                
               
                </div>

              <div>
                <button onClick={()=>{
                  remove(application.intern._id);
                }}>Withdraw Application</button>
              </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
