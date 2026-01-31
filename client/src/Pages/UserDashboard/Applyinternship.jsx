import { useEffect, useState } from "react"
import { Bookmark, MapPin, Briefcase, Calendar, ArrowRight } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router"

export default function ApplyInternships() {
  const [bookmarked, setBookmarked] = useState({})
  const [interns, setInterns] = useState([  {
            title: "Full stack developer",
            location: "Bihar",
            skill_required: ["React.js", "Next.js"],
          }])

  const navigate = useNavigate();

  async function getInternship() {
    try {
      const res = await axios.get("https://internship-extension.onrender.com/api/v1/user/getallintern", {
        withCredentials: true,
      })

      setInterns(
        res.data.data|| [
          {
            title: "Full stack developer",
            location: "Bihar",
            skill_required: ["React.js", "Next.js"],
          },
        ]
      )
    } catch (error) {
      console.log(error)
    }
  }

  const toggleBookmark = (id) => {
    setBookmarked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  async function apply(id) {
    try {
      await axios.post(
        "https://internship-extension.onrender.com/api/v1/user/applyforintern",
        { internid:id },
        { withCredentials: true }
      )
      alert("Successfully applied")
    } catch (error) {
      console.log(error)
    }
  }

  async function bookmark(id) {
    try {
      await axios.post(
        "https://internship-extension.onrender.com/api/v1/user/bookmarked_internships",
        { internid:id },
        { withCredentials: true }
      )
      toggleBookmark(id)
      alert("Successfully bookmarked")
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getInternship()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Available Internships
        </h2>
        <p className="text-gray-500">
          AI-matched opportunities tailored for you
        </p>
      </div>

      {/* INTERNSHIP LIST (SINGLE COLUMN) */}
      <div className="flex flex-col gap-6">
        {interns.map((internship) => {
          const seatsLeft =
            internship.seats - internship.accepted_students

          return (
            <div
              key={internship._id}
              className="bg-white rounded-xl border shadow-sm p-6 hover:shadow-md transition"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 text-xl">
                    {internship.logo || internship.title?.[0] || "🏢"}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {internship.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {internship.company || "Company"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => bookmark(internship._id)}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <Bookmark
                    size={20}
                    fill={
                      bookmarked[internship._id]
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>
              </div>

              {/* DESCRIPTION */}
              <p className="text-gray-600 mt-4">
                {internship.short_description ||
                  "No description provided"}
              </p>

              {/* DETAILS */}
              <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  {internship.location || "Remote"}
                </div>

                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  {internship.duration_in_months} months
                </div>

                <div className="flex items-center gap-1">
                  <Briefcase size={16} />
                  {internship.status || "Open"}
                </div>
              </div>

              {/* STATS */}
              <div className="flex gap-8 mt-6">
                <div>
                  <p className="text-xs text-gray-500">Seats Left</p>
                  <p className="font-semibold">
                    {seatsLeft > 0 ? seatsLeft : "Filled"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Applicants</p>
                  <p className="font-semibold">
                    {internship.applicant_count || 0}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Stipend</p>
                  <p className="font-semibold">
                    ₹{internship.stipend}/month
                  </p>
                </div>
              </div>

              {/* APPLY BUTTON */}
              <div className="flex gap-4">
                 <button
                disabled={seatsLeft <= 0}
                onClick={() => apply(internship._id)}
                className={`mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium transition
                  ${
                    seatsLeft <= 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                Apply Now <ArrowRight size={16} />
              </button>
                   
                   <button className="mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-lg  font-medium transition" onClick={()=>{ navigate(`/dashboard/apply/interndetail/${internship._id}`);

                   }}>View Details</button>

              </div>
             
            </div>
          )
        })}
      </div>
    </div>
  )
}
