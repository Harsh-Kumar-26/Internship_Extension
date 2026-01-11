import axios from "axios";
import { useState } from "react";
import {useNavigate} from "react-router"

function RegisterModal({ open, onClose }) {
  if (!open) return null;

  // ================= STATE =================
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

  // ================= SKILLS =================
  const addSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  // ================= SUBMIT =================
  async function Signup(e) {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/v1/common/signup", {
        fullname,
        email,
        password,
        gender,
        date_of_birth: dateOfBirth,
        portfolio_link: portfolioLink,
        cntry_code: cntryCode,
        phone_number: phoneNumber,
        skills,
        location,
        rural,
        tribal,
        resume,
        role,
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-white w-full max-w-xl rounded-xl p-6 shadow-lg">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Register</h2>
            <button onClick={onClose} className="text-xl">✕</button>
          </div>

          <form onSubmit={Signup} className="space-y-4">

            <input
              type="text"
              placeholder="Full Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="input"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />

            {/* Gender */}
            <div>
              <p className="font-semibold mb-2">Gender</p>
              <div className="flex gap-6">
                {["Male", "Female", "Prefer not to say"].map((g) => (
                  <label key={g} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      onChange={(e) => setGender(e.target.value)}
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="input"
            />

            <input
              type="url"
              placeholder="Portfolio Link"
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
              className="input"
            />

            {/* Country code + Phone */}
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                value={cntryCode}
                onChange={(e) => setCntryCode(e.target.value)}
                className="input"
              />
              <input
                type="number"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="input col-span-2"
              />
            </div>

            {/* Skills */}
            <div>
              <input
                type="text"
                placeholder="Add skill & press Enter"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={addSkill}
                className="input"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Tribal (0 or 1)"
                value={tribal}
                onChange={(e) => setTribal(Number(e.target.value))}
                className="input"
              />
              <input
                type="number"
                placeholder="Rural (0 or 1)"
                value={rural}
                onChange={(e) => setRural(Number(e.target.value))}
                className="input"
              />
            </div>

            {/* Role */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={role === "admin"}
                onChange={(e) =>
                  setRole(e.target.checked ? "admin" : "user")
                }
              />
              Admin
            </label>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              Register
            </button>

          </form>
        </div>
      </div>
    </>
  );
}

export default RegisterModal;


function LoginModal({ open, onClose }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("");

  const navigate = useNavigate();


  async function Signin(e) {
    e.preventDefault();
    try {
     const res = await axios.post("http://localhost:8000/api/v1/common/login", { email, password })
        if(res){
           navigate("/dashboard");
        }
      

    } catch (error) {
      console.log(error);

    }
  }



  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg relative">

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Login</h2>
            <button onClick={onClose} className="text-xl">✕</button>
          </div>

          <form className="space-y-4" onSubmit={Signin}>

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              className="input"
              required
              onChange={(e)=>{
                         setEmail(e.target.value);
              }}
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              className="input"
              required
              onChange={(e)=>{
                     setPassword(e.target.value)
              }}
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg"
            >
              Login
            </button>

          </form>
        </div>
      </div>
    </>
  );
}



export { LoginModal, RegisterModal };