import axios from "axios"
import {
  MapPin,
  Calendar,
  Briefcase,
  Users,
  IndianRupee,
  CheckCircle,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
const DUMMY_INTERNSHIP = {
  title: "Sample Internship",
  company: "Demo Company",
  location: "Bihar",
  duration: "0 Months",
  stipend: 0,
  seats: 0,
  accepted: 0,
  applicants: 0,
  status: "Open",
  description: "This is a dummy internship shown when no ID is provided.",
  skills: ["React", "Node.js"],
  responsibilities: ["Dummy responsibility"],
  perks: ["Certificate"],
}

export default function Internship() {
  const { internid } = useParams()
  console.log(internid);
  

  const [internship, setInternship] = useState(null)
  const [loading, setLoading] = useState(true)

  async function getInternDetails(id) {
    try {
              
     
           

      const res = await axios.get(
        `https://internship-extension.onrender.com/getintern/${id}`,
        { withCredentials: true }
      )

      const intern = res.data

      setInternship({
        title: intern.title,
        location: intern.location,
        duration: `${intern.duration_in_months} Months`,
        stipend: intern.stipend,
        seats: intern.seats,
        accepted: intern.accepted_students,
        applicants: intern.applicant_count,
        status: intern.status || "Open",
        description: intern.short_description,
        skills: intern.skills_required || [],
        responsibilities: intern.responsibilities || [],
        perks: intern.perks || [],
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

   useEffect(() => {
    if (internid===undefined) {
      // ✅ SHOW DUMMY DATA
      setInternship(DUMMY_INTERNSHIP)
      setLoading(false)
      return
    }

    getInternDetails(internid)
  }, [internid])


  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading internship details...
      </div>
    )
  }

  if (!internship) return null

  const seatsLeft = internship.seats - internship.accepted

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* ===== HEADER ===== */}
      <div className="bg-white rounded-xl border shadow-sm p-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {internship.title}
        </h1>
        <p className="text-gray-600 mt-1">{internship.company}</p>

        <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <MapPin size={16} /> {internship.location}
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} /> {internship.duration}
          </div>
          <div className="flex items-center gap-2">
            <Briefcase size={16} /> {internship.status}
          </div>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        <Stat
          icon={<IndianRupee size={20} />}
          label="Stipend"
          value={`₹${internship.stipend}/month`}
        />
        <Stat
          icon={<Users size={20} />}
          label="Applicants"
          value={internship.applicants}
        />
        <Stat
          icon={<CheckCircle size={20} />}
          label="Seats Left"
          value={seatsLeft > 0 ? seatsLeft : "Filled"}
        />
      </div>

      {/* ===== DESCRIPTION ===== */}
      <section className="mt-10 bg-white rounded-xl border p-8">
        <h2 className="text-xl font-semibold mb-3">
          Internship Description
        </h2>
        <p className="text-gray-600 leading-relaxed">
          {internship.description}
        </p>
      </section>

      {/* ===== RESPONSIBILITIES ===== */}
      {internship.responsibilities.length > 0 && (
        <section className="mt-8 bg-white rounded-xl border p-8">
          <h2 className="text-xl font-semibold mb-4">
            Responsibilities
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-600">
            {internship.responsibilities.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {/* ===== SKILLS ===== */}
      <section className="mt-8 bg-white rounded-xl border p-8">
        <h2 className="text-xl font-semibold mb-4">
          Required Skills
        </h2>
        <div className="flex flex-wrap gap-3">
          {internship.skills.map((skill, i) => (
            <span
              key={i}
              className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* ===== PERKS ===== */}
      {internship.perks.length > 0 && (
        <section className="mt-8 bg-white rounded-xl border p-8">
          <h2 className="text-xl font-semibold mb-4">
            Perks & Benefits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-600">
            {internship.perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                {perk}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== APPLY BUTTON ===== */}
      <div className="mt-10 flex justify-end">
        <button
          disabled={seatsLeft <= 0}
          className={`px-8 py-3 rounded-xl font-medium transition text-white
            ${
              seatsLeft <= 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          Apply for Internship
        </button>
      </div>
    </div>
  )
}

/* ===== STAT COMPONENT ===== */
function Stat({ icon, label, value }) {
  return (
    <div className="bg-white border rounded-xl p-6 flex items-center gap-4 shadow-sm">
      <div className="text-blue-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  )
}
