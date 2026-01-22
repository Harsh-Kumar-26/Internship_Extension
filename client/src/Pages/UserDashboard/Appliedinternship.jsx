import { MapPin, Calendar, Trash2, Building2, ArrowRight } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AppliedInternships() {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. Fetch Data ---
  async function getAppliedInternships() {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/user/allapplied_internships",
        { withCredentials: true }
      );
      setInterns(res.data.data?.interns || []);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  // --- 2. Withdraw Logic ---
  async function remove(internshipId) {
    if (!window.confirm("Are you sure you want to withdraw?")) return;

    const previousInterns = [...interns];
    setInterns(interns.filter((item) => item.intern._id !== internshipId)); // Optimistic remove

    try {
      await axios.post(
        "http://localhost:8000/removefromintern",
        { internshipId },
        { withCredentials: true }
      );
    } catch (error) {
      setInterns(previousInterns); // Revert on fail
      alert("Could not withdraw application.");
    }
  }

  useEffect(() => {
    getAppliedInternships();
  }, []);

  // --- 3. Styles Helper ---
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted": return "text-emerald-600 bg-emerald-50";
      case "rejected": return "text-rose-600 bg-rose-50";
      default: return "text-amber-600 bg-amber-50";
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      
      {/* MAIN CONTAINER (Centered on page) */}
      <div className="max-w-5xl mx-auto py-16 px-6 sm:px-8">
        
        {/* HEADER */}
        <div className="flex items-baseline justify-between border-b border-slate-100 pb-8 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              My Applications
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              Manage your ongoing internship applications.
            </p>
          </div>
          <span className="text-sm font-semibold text-slate-400">
            {interns.length} Applications
          </span>
        </div>

        {/* CLEAN LIST VIEW (No Cards, Direct Rows) */}
        <div className="flex flex-col">
          
          {interns.length === 0 ? (
            <EmptyState />
          ) : (
            interns.map((app, index) => {
              const { intern, status } = app;
              
              return (
                <div 
                  key={intern._id}
                  className="group py-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-colors -mx-4 px-4 rounded-xl"
                >
                  {/* LEFT: INFO */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {intern.title}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${getStatusColor(status)}`}>
                        {status || "Pending"}
                      </span>
                    </div>

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
                      <span className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {intern.type || "Full Time"}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT: ACTIONS */}
                  <div className="flex items-center gap-4">
                    
                    {/* Withdraw Button (Only if pending) */}
                    {status !== 'rejected' && status !== 'accepted' && (
                       <button 
                         onClick={() => remove(intern._id)}
                         className="text-slate-400 hover:text-rose-600 font-medium text-sm transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-rose-50"
                       >
                         Withdraw
                       </button>
                    )}

                    {/* View Details / Status Indicator */}
                    {status === 'accepted' ? (
                       <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-full hover:bg-black transition-all">
                         View Offer <ArrowRight className="w-4 h-4" />
                       </button>
                    ) : (
                       <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-300 group-hover:border-indigo-200 group-hover:text-indigo-600 transition-all">
                         <ArrowRight className="w-5 h-5" />
                       </div>
                    )}
                  </div>

                </div>
              );
            })
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
      <h3 className="text-xl font-bold text-slate-900">No applications found</h3>
      <p className="text-slate-500 mt-2 max-w-sm mx-auto">
        You haven't applied to any internships yet. Once you apply, they will appear right here.
      </p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-6">
      <div className="h-10 w-64 bg-slate-100 rounded mb-12 animate-pulse" />
      <div className="space-y-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 w-full bg-slate-50 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}