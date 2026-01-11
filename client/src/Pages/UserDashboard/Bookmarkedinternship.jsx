

import { useEffect, useState } from "react"
import { Bookmark, MapPin, Calendar, Briefcase, Trash2, ArrowRight, Cross } from "lucide-react"
import axios from "axios"

const mockBookmarked = [
  {
    id: 1,
    company: "Google",
    position: "Software Engineer Intern",
    location: "Mountain View, CA",
    duration: "3 months",
    matchScore: 94,
    skills: ["Python", "JavaScript", "React", "SQL"],
    logo: "🔍",
  },
  {
    id: 3,
    company: "Microsoft",
    position: "Cloud Engineer Intern",
    location: "Seattle, WA",
    duration: "3 months",
    matchScore: 82,
    skills: ["Cloud", "DevOps", "C#", "Azure"],
    logo: "⚪",
  },
]

export default function BookmarkedInternships() {
  const [saved, setSaved] = useState(mockBookmarked)

  const removeBookmark = (id) => {
    setSaved(saved.filter((item) => item.id !== id))
  }

   const [interns, setInterns] = useState([])

  async function getbookmarked_Internship() {
    try {
      const res = await axios.get("allbookmarked_internships", { withCredentials: true })
      setInterns(res.data.interns || [])
    } catch (error) {
      console.log(error)
    }
  }

async function removebookmark(id) {
  
  try {
    axios.post("remove_bookmarked_internship",{id},{withCredentials:true});
     getbookmarked_Internship();
  } catch (error) {
    console.log(error);
    
  }
}

  async function apply(id) {
    try {
      axios.post("applyforintern",{id},{withCredentials:true});

          alert("Successfully applied");

    } catch (error) {
      console.log(error);
      
    }
  }


useEffect(()=>{
getbookmarked_Internship();
},[interns])

  return (
    <div className="feature-page">
      <div className="page-header">
        <h2 className="page-title">Bookmarked Internships</h2>
        <p className="page-subtitle">{saved.length} internships saved for later</p>
      </div>

      {saved.length === 0 ? (
        <div className="empty-state">
          <Bookmark size={48} />
          <h3>No Bookmarks Yet</h3>
          <p>Bookmark internships to save them for later review</p>
        </div>
      ) : (
        <div className="internships-grid">
          {interns.map((internship) => (
            <div key={internship._id} className="internship-card">
              <div className="card-header">
                <div className="company-info">
                  <div className="company-logo">{internship.logo}</div>
                  <div>
                    <h3 className="company-name">{internship.company}</h3>
                    <p className="position-title">{internship.position}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeBookmark(internship._id)}
                  className="delete-btn"
                  aria-label="Remove bookmark"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="card-details">
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>{internship.location}</span>
                </div>
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>{internship.duration_in_months}</span>
                </div>
                <div className="detail-item">
                  <Briefcase size={16} />
                  <span>On-site</span>
                </div>
              </div>

              <div className="skills-section">
                <p className="skills-label">Top Skills:</p>
                <div className="skills-tags">
                  {internship.skills.map((skill) => (
                    <span key={skill} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>



              <div className="flex gap-4">
                <button className="apply-btn" onClick={()=>{
                apply(internship._id);
              }}>
                Apply Now
                <ArrowRight size={16} />
              </button>
              <button className="apply-btn" onClick={()=>{
                removebookmark(internship._id);
              }}>
                Remove
                <Cross size={16} />
              </button>
              </div>

              <button className="apply-btn" onClick={()=>{
                apply(internship._id);
              }}>
                Apply Now
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
