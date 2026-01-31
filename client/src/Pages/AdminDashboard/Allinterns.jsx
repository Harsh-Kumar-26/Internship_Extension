import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AllInterns() {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function getAllInterns() {
    try {
      const res = await axios.get(
        "https://internship-extension.onrender.com/api/v1/admin/getadminallinterns",
        { withCredentials: true }
      );
      setInterns(res.data.data || res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getAllInterns();
  }, []);

  /* --- HANDLERS --- */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this internship?")) return;
    try {
      await axios.delete(`https://internship-extension.onrender.com/api/v1/admin/deleteintern/${id}`, { withCredentials: true });
      getAllInterns()
    } catch (error) { console.log(error); }
  };

  const handleStatusChange = async (id, newStatus) => {
    // Optimistic UI Update (update immediately before server response)
   
    
    try {
      await axios.post(`https://internship-extension.onrender.com/api/v1/admin/internstatuschange/${id}`, { status: newStatus }, { withCredentials: true });
      getAllInterns()
    } catch (error) {
      console.log(error);
      
    }
  };

  /* --- UI HELPERS --- */
  const getStatusBorder = (status) => {
    switch (status) {
      case "open": return "border-l-emerald-500";
      case "closed": return "border-l-rose-500";
      case "paused": return "border-l-amber-500";
      default: return "border-l-gray-300";
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      
      {/* PAGE HEADER */}
      <div className="max-w-5xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Internships</h1>
          <p className="text-slate-500 mt-2">Manage listings, track applicants, and update status.</p>
        </div>
        <button 
          onClick={() => navigate('/admindashboard/createintern')}
          className="group relative inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
        >
          <span className="mr-2 text-xl">+</span> Create New
        </button>
      </div>

      {/* CARDS LIST - DIRECTLY ON PAGE */}
      <div className="max-w-5xl mx-auto space-y-4">
        
        {interns.length === 0 && <EmptyState />}

        {interns.map((intern, index) => {

          if(intern!=null){
            return(<motion.div
            key={intern._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`group relative bg-white rounded-r-xl rounded-l-sm shadow-sm hover:shadow-xl transition-all duration-300 border-l-[6px] ${getStatusBorder(intern.status)}`}
          >
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between">
              
              {/* LEFT: MAIN INFO */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {intern.title}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${intern.status === 'open' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                    {intern.status}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    {intern.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    {intern.duration_in_months} Months
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a1 1 0 11-2 0 1 1 0 012 0z"/></svg>
                    ₹{intern.stipend} / month
                  </div>
                </div>
              </div>

              {/* MIDDLE: APPLICANTS COUNTER */}
              <div className="flex flex-col items-center justify-center px-6 md:border-l md:border-r border-slate-100 min-w-[120px]">
                <span className="text-3xl font-bold text-slate-800">{intern.applicant_count || 0}</span>
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Applicants</span>
              </div>

              {/* RIGHT: ACTIONS */}
              <div className="flex flex-col gap-3 min-w-[160px]">
                <div className="grid grid-cols-2 gap-2">
                   <button 
                     onClick={() => navigate(`/admindashboard/intern/applications/${intern._id}`)}
                     className="col-span-2 py-2 px-3 bg-slate-900 text-white text-sm font-medium rounded hover:bg-slate-800 transition-colors"
                   >
                     View Applicants
                   </button>
                   <button 
                     onClick={() => navigate(`/admindashboard/editintern/${intern._id}`)}
                     className="py-2 px-3 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded hover:bg-slate-50 transition-colors"
                   >
                     Edit
                   </button>
                   <button 
                     onClick={() => handleDelete(intern._id)}
                     className="py-2 px-3 bg-white border border-rose-100 text-rose-600 text-sm font-medium rounded hover:bg-rose-50 transition-colors"
                   >
                     Delete
                   </button>
                </div>
                
                {/* Status Dropdown */}
                <div className="relative">
                  <select
                    value={intern.status}
                    onChange={(e) => handleStatusChange(intern._id, e.target.value)}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-1.5 px-3 pr-8 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="open">Status: Open</option>
                    <option value="paused">Status: Paused</option>
                    <option value="closed">Status: Closed</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>)
          } 
        
          
})}
      </div>
    </div>
  );
}

/* --- COMPONENTS FOR CLEANER CODE --- */

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 max-w-5xl mx-auto space-y-4">
      <div className="h-10 w-48 bg-slate-200 rounded mb-10 animate-pulse"></div>
      {[1, 2, 3].map(i => (
        <div key={i} className="h-40 bg-white rounded-lg shadow-sm border border-slate-100 animate-pulse"></div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
      <div className="text-4xl mb-4">📂</div>
      <h3 className="text-lg font-medium text-slate-900">No internships posted yet</h3>
      <p className="text-slate-500">Create your first internship to get started.</p>
    </div>
  );
}