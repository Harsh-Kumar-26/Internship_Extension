import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { 
  X, User, Mail, Lock, Calendar, Globe, Phone, 
  MapPin, Briefcase, FileText, CheckCircle2 
} from "lucide-react";

// ================= REUSABLE UI COMPONENTS =================

const InputField = ({ label, icon: Icon, type = "text", ...props }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">
      {label}
    </label>
    <div className="relative group">
      {Icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        type={type}
        className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 ${Icon ? 'pl-10' : ''} text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all`}
        {...props}
      />
    </div>
  </div>
);

const SelectField = ({ label, children, ...props }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block">
      {label}
    </label>
    <div className="relative">
      <select
        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
        {...props}
      >
        {children}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  </div>
);

// ================= REGISTER MODAL =================

function RegisterModal({ open, onClose }) {
  if (!open) return null;

  // State
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [resume, setResume] = useState("");
  const [cntryCode, setCntryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [location, setLocation] = useState("");
  const [rural, setRural] = useState(0);
  const [tribal, setTribal] = useState(0);
  const [role, setRole] = useState("user");

  const addSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  async function Signup(e) {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/v1/common/signup", {
        fullname, email, password, gender, date_of_birth: dateOfBirth,
        portfolio_link: portfolioLink, cntry_code: cntryCode, phone_number: phoneNumber,
        skills, location, rural, tribal, resume, role,
      });
      alert(res.data.message || "Registered successfully");
      onClose();
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert(error.response?.data?.message || "Signup failed");
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        <div className="bg-white dark:bg-slate-800 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 z-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Account</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Join us to find your perfect match</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Scrollable Form Content */}
          <div className="overflow-y-auto p-6 custom-scrollbar">
            <form onSubmit={Signup} className="space-y-6">
              
              {/* Section: Personal Info */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Full Name" icon={User} placeholder="John Doe" value={fullname} onChange={(e) => setFullname(e.target.value)} />
                  <InputField label="Email Address" icon={Mail} type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <InputField label="Password" icon={Lock} type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <InputField label="Date of Birth" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                </div>
                
                {/* Gender Radio */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Gender</label>
                  <div className="flex flex-wrap gap-4">
                    {["Male", "Female", "Prefer not to say"].map((g) => (
                      <label key={g} className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${gender === g ? 'border-blue-500' : 'border-slate-300'}`}>
                          {gender === g && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                        </div>
                        <input type="radio" name="gender" value={g} onChange={(e) => setGender(e.target.value)} className="hidden" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{g}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <hr className="border-slate-100 dark:border-slate-700" />

              {/* Section: Professional */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Professional Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Portfolio URL" icon={Globe} type="url" placeholder="https://..." value={portfolioLink} onChange={(e) => setPortfolioLink(e.target.value)} />
                  <InputField label="Resume URL" icon={FileText} type="url" placeholder="Google Drive Link..." value={resume} onChange={(e) => setResume(e.target.value)} />
                </div>

                {/* Skills Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Skills</label>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, i) => (
                        <span key={i} className="inline-flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-md text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm">
                          {skill}
                          <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      className="w-full bg-transparent border-none p-0 text-sm focus:ring-0 placeholder:text-slate-400"
                      placeholder="Type a skill and press Enter (e.g. React, Node.js)"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={addSkill}
                    />
                  </div>
                </div>
              </div>

              <hr className="border-slate-100 dark:border-slate-700" />

              {/* Section: Contact & Location */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contact & Location</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <InputField label="Code" placeholder="+91" value={cntryCode} onChange={(e) => setCntryCode(e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <InputField label="Phone Number" icon={Phone} type="number" placeholder="9876543210" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField label="Location (City)" icon={MapPin} placeholder="Mumbai" value={location} onChange={(e) => setLocation(e.target.value)} />
                  <div className="grid grid-cols-2 gap-4">
                    <SelectField label="Area Type" value={rural} onChange={(e) => setRural(Number(e.target.value))}>
                      <option value={0}>Urban</option>
                      <option value={1}>Rural</option>
                    </SelectField>
                    <SelectField label="Category" value={tribal} onChange={(e) => setTribal(Number(e.target.value))}>
                      <option value={0}>General</option>
                      <option value={1}>Tribal</option>
                    </SelectField>
                  </div>
                </div>
              </div>

              {/* Admin Checkbox */}
              <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 transition-all checked:border-blue-500 checked:bg-blue-500"
                    checked={role === "admin"}
                    onChange={(e) => setRole(e.target.checked ? "admin" : "user")}
                  />
                  <CheckCircle2 className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100" />
                </div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Register as Administrator
                </label>
              </div>

            </form>
          </div>

          {/* Footer (Fixed at bottom) */}
          <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
            <button
              onClick={Signup}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
            >
              Create Account
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

// ================= LOGIN MODAL =================

function LoginModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function Signin(e) {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/v1/common/login", { email, password }, { withCredentials: true });
      
      if (res.data.data.user.role === "admin") {
        navigate("/admindashboard/adminallintern");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      alert("Login Failed");
    }
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
          
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Sign in to access your dashboard</p>
            </div>

            <form className="space-y-5" onSubmit={Signin}>
              <InputField 
                label="Email Address" 
                icon={Mail} 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
              
              <div className="space-y-1.5">
                <InputField 
                  label="Password" 
                  icon={Lock} 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
                <div className="flex justify-end">
                  <button type="button" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    Forgot password?
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all mt-2"
              >
                Sign In
              </button>
            </form>
          </div>
          
          
        </div>
      </div>
    </>
  );
}

export { LoginModal, RegisterModal };