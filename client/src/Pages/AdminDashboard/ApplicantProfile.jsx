import axios from "axios";
import { useEffect, useState } from "react";

export default function Applicant({ id }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApplicantProfile();
  }, [id]);

  async function getApplicantProfile() {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/common/getuser/${id}`,
        { withCredentials: true }
      );
      setUser(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-lg font-medium">Loading applicant profile...</p>
      </div>
    );
  }

  if (!user) {
    return <p className="text-center text-red-500">User not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h1 className="text-3xl font-bold">{user.fullname}</h1>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-sm text-gray-500 mt-1">
          Role: {user.role.toUpperCase()}
        </p>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Info label="Gender" value={user.gender} />
        <Info
          label="Date of Birth"
          value={new Date(user.date_of_birth).toLocaleDateString()}
        />
        <Info label="Location" value={user.location || "Not specified"} />
        <Info
          label="Phone"
          value={`${user.cntry_code} ${user.phone_number || "N/A"}`}
        />
        <Info label="Rural" value={user.rural ? "Yes" : "No"} />
        <Info label="Tribal" value={user.tribal ? "Yes" : "No"} />
      </div>

      {/* Skills */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Skills</h2>
        {user.skills?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No skills added</p>
        )}
      </div>

      {/* Links */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-3">Documents & Links</h2>

        <div className="flex flex-col gap-2">
          <a
            href={user.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            📄 View Resume
          </a>

          <a
            href={user.portfolio_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            🌐 Portfolio Website
          </a>
        </div>
      </div>

      {/* Applied Internships */}
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-3">Applied Internships</h2>

        {user.applied_internships?.length > 0 ? (
          <ul className="space-y-2">
            {user.applied_internships.map((app) => (
              <li
                key={app._id}
                className="flex justify-between border p-3 rounded-lg"
              >
                <span>{app.applied}</span>
                <span
                  className={`font-medium ${
                    app.status === "accepted"
                      ? "text-green-600"
                      : app.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {app.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No applications yet</p>
        )}
      </div>
    </div>
  );
}

/* Reusable Info Component */
function Info({ label, value }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
