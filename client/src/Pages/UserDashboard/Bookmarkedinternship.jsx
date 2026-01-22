import { MapPin, Calendar, Trash2, Building2, ArrowRight, ExternalLink } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BookmarkedInternships() {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- 1. Fetch Data ---
  async function getBookmarkedInternships() {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/user/allbookmarked_internships",
        { withCredentials: true }
      );
      // specific check based on your previous structure
      setInterns(res.data.data || res.data.data?.interns || []); 
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  // --- 2. Remove Logic (Optimistic) ---
  async function removeBookmark(id) {
    // 1. Remove from UI immediately
    const previousInterns = [...interns];
    setInterns(interns.filter((item) => item._id !== id));

    try {
      // 2. Send request to server
      await axios.post(
        "http://localhost:8000/remove_bookmarked_internship",
        { id },
        { withCredentials: true }
      );
    } catch (error) {
      // 3. Revert if server fails
      console.log(error);
      setInterns(previousInterns);
      alert("Failed to remove bookmark.");
    }
  }

  // --- 3. Apply Logic ---
  async function apply(id) {
    try {
      await axios.post(
        "http://localhost:8000/applyforintern",
        { id },
        { withCredentials: true }
      );
      alert("Application sent successfully!");
      // Optional: Remove from bookmarks after applying?
      // removeBookmark(id); 
    } catch (error) {
      console.log(error);
      alert("Something went wrong while applying.");
    }
  }

  useEffect(() => {
    getBookmarkedInternships();
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      
      {/* MAIN CONTAINER */}
      <div className="max-w-5xl mx-auto py-16 px-6 sm:px-8">
        
        {/* HEADER */}
        <div className="flex items-baseline justify-between border-b border-slate-100 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Saved Internships
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Opportunities you've bookmarked for later.
            </p>
          </div>
          <span className="text-sm font-semibold text-slate-400">
            {interns.length} Saved
          </span>
        </div>

        {/* LIST VIEW */}
        <div className="flex flex-col">
          
          {interns.length === 0 ? (
            <EmptyState />
          ) : (
            interns.map((intern) => (
              <div 
                key={intern._id}
                className="group py-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors -mx-4 px-4 rounded-xl"
              >
                {/* LEFT: INFO */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {intern.title || intern.company}
                    </h3>
                  </div>

                  {intern.position && (
                    <p className="text-slate-600 font-medium mb-3">{intern.position}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-6 text-slate-500 text-sm font-medium mt-3">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {intern.location || "Remote"}
                    </span>
                    {intern.duration_in_months && (
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {intern.duration_in_months} Months
                      </span>
                    )}
                    {/* Skills Tags (if available) */}
                    {intern.skills && intern.skills.length > 0 && (
                      <div className="hidden sm:flex gap-2">
                         {intern.skills.slice(0, 3).map(skill => (
                           <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs border border-slate-200">
                             {skill}
                           </span>
                         ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT: ACTIONS */}
                <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                  
                  {/* Remove Button */}
                  <button 
                    onClick={() => removeBookmark(intern._id)}
                    className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  {/* Details Button */}
                  <button 
                    onClick={() => navigate(`/internship/${intern._id}`)}
                    className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                    title="View Details"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>

                  {/* Apply Button */}
                  <button 
                    onClick={() => apply(intern._id)}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-full hover:bg-indigo-600 hover:shadow-lg hover:-translate-y-0.5 transition-all ml-2"
                  >
                    Apply Now <ArrowRight className="w-4 h-4" />
                  </button>

                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function EmptyState() {
  return (
    <div className="text-center py-24">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-6">
        <Building2 className="w-8 h-8 text-slate-300" />
      </div>
      <h3 className="text-xl font-bold text-slate-900">No saved internships</h3>
      <p className="text-slate-500 mt-2 max-w-sm mx-auto">
        When you find an internship you like, bookmark it to save it here for later.
      </p>
      <a href="/allinternships" className="inline-block mt-6 text-indigo-600 font-medium hover:underline">
        Browse Internships →
      </a>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <div className="h-10 w-48 bg-slate-100 rounded mb-12 animate-pulse" />
      <div className="space-y-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 w-full bg-slate-50 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}