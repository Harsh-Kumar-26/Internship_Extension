import axios from "axios";
import { useEffect, useState } from "react";
import { MapPin, Clock, IndianRupee, Users, Calendar } from "lucide-react";
import { useParams } from "react-router";

export default function Internship() {
  const [intern, setIntern] = useState(null);
  const [loading, setLoading] = useState(true);
  const {internid}= useParams();
  
  

  useEffect(() => {
    async function getIntern() {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/common/getintern/${internid}`,
          { withCredentials: true }
        );
        setIntern(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getIntern();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-lg font-medium">Loading internship details...</p>
      </div>
    );
  }

  if (!intern) {
    return <p className="text-center text-red-500">Internship not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">{intern.title}</h1>

      {/* Status */}
      <span
        className={`inline-block px-3 py-1 text-sm rounded-full mb-6
          ${
            intern.status === "open"
              ? "bg-green-100 text-green-700"
              : intern.status === "closed"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }
        `}
      >
        {intern.status.toUpperCase()}
      </span>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Info icon={<MapPin size={18} />} label="Location" value={intern.location} />
        <Info
          icon={<IndianRupee size={18} />}
          label="Stipend"
          value={`₹ ${intern.stipend}`}
        />
        <Info
          icon={<Clock size={18} />}
          label="Duration"
          value={`${intern.duration_in_months} months`}
        />
        <Info
          icon={<Users size={18} />}
          label="Seats"
          value={`${intern.accepted_students} / ${intern.seats} filled`}
        />
        <Info
          icon={<Calendar size={18} />}
          label="Start Date"
          value={new Date(intern.start_date).toLocaleDateString()}
        />
      </div>

      {/* Skills */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Skills Required</h2>
        <p className="text-gray-700">{intern.skills_required}</p>
      </div>

      {/* Short Description */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">About Internship</h2>
        <p className="text-gray-700 leading-relaxed">
          {intern.short_description}
        </p>
      </div>

      {/* Description Link */}
      <div className="mb-8">
        <a
          href={intern.description_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 font-medium hover:underline"
        >
          View Full Description →
        </a>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Apply Now
        </button>

        <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
          Bookmark
        </button>
      </div>
    </div>
  );
}

/* Reusable Info Card */
function Info({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-4 border rounded-lg bg-white shadow-sm">
      <div className="text-blue-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
