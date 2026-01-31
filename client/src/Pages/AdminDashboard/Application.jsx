import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // 1. Import useParams
import { motion } from "framer-motion";

export default function Application() {
  const { internid } = useParams(); // 2. Get ID from URL
  console.log(internid);
  

  const navigate = useNavigate();
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [internTitle, setInternTitle] = useState(""); // To show which internship this is for

  useEffect(() => {
    if (internid) fetchApplications();
  }, [internid]);

  async function fetchApplications() {
    try {
      const res = await axios.get(
        "https://internship-extension.onrender.com/api/v1/admin/internshipscored",
        { withCredentials: true }
      );

      // Find matching internship using the ID from params
      const matchedIntern = res.data.data.find((intern) => intern._id === id);

      if (matchedIntern) {
        setApplications(matchedIntern.applied_users);
        setInternTitle(matchedIntern.title);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  /* --- ACTION HANDLERS --- */
  
  const updateStatus = async (userid, action) => {
    // Optimistic UI update
    const previousState = [...applications];
    setApplications(apps => apps.map(app => 
      app.applied._id === userid 
        ? { ...app, status: action === 'accept' ? 'accepted' : 'rejected' } 
        : app
    ));

    try {
      const endpoint = action === 'accept' 
        ? "https://internship-extension.onrender.com/api/v1/admin/acceptapplication"
        : "https://internship-extension.onrender.com/api/v1/admin/rejectapplication";

      await axios.post(
        endpoint,
        { id, userid },
        { withCredentials: true }
      );
      // Optional: fetchApplications() to ensure sync, but optimistic is faster
    } catch (error) {
      console.log(error);
      setApplications(previousState); // Revert on error
      alert("Something went wrong");
    }
  };

  const bookmarkUser = async (userid) => {
    try {
      await axios.post(
        "https://internship-extension.onrender.com/api/v1/admin/bookmarkuser",
        { id, userid },
        { withCredentials: true }
      );
      alert("User bookmarked!");
    } catch (error) {
      console.log(error);
    }
  };

  /* --- UI HELPERS --- */

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "??";
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "rejected": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button 
              onClick={() => navigate(-1)} 
              className="text-sm text-slate-500 hover:text-indigo-600 mb-2 flex items-center gap-1"
            >
              ← Back to Internships
            </button>
            <h1 className="text-3xl font-bold text-slate-800">
              Applications
            </h1>
            <p className="text-slate-500 mt-1">
              Candidates for <span className="font-semibold text-indigo-600">{internTitle || "Unknown Role"}</span>
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 text-sm font-medium text-slate-600">
            Total: {applications.length}
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {applications.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-lg font-medium text-slate-900">No applications yet</h3>
              <p className="text-slate-500">Wait for students to apply.</p>
            </div>
          ) : (
            applications.map((app, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={app.applied._id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row items-start md:items-center gap-5 hover:shadow-md transition-all"
              >
                {/* AVATAR & NAME */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    {getInitials(app.applied.name)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{app.applied.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusBadge(app.status)}`}>
                        {app.status || "Pending"}
                      </span>
                      <span className="text-xs text-slate-400">• Applied recently</span>
                    </div>
                  </div>
                </div>

                {/* ACTION TOOLBAR */}
                <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 justify-end">
                  
                  <button
                    onClick={() => window.open(`/profile/${app.applied._id}`, "_blank")}
                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                    title="View Profile"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() => bookmarkUser(app.applied._id)}
                    className="p-2 text-slate-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors"
                    title="Bookmark"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                  </button>

                  <div className="h-6 w-px bg-slate-200 mx-1"></div>

                  <button
                    onClick={() => updateStatus(app.applied._id, 'reject')}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Reject"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>

                  <button
                    onClick={() => updateStatus(app.applied._id, 'accept')}
                    className="px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    Accept
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="h-8 bg-slate-200 rounded w-1/3 mb-8 animate-pulse"></div>
      {[1, 2, 3].map(i => (
        <div key={i} className="h-24 bg-white rounded-xl border border-slate-200 animate-pulse"></div>
      ))}
    </div>
  );
}