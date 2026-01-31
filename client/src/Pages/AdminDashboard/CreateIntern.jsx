import axios from "axios";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

/* =======================
   STEP CONFIG
======================= */
const steps = [
  { id: 1, name: "Title", label: "title", placeholder: "Senior Frontend Engineer", type: "text" },
  { id: 2, name: "Skills", label: "skills_required", placeholder: "React, Node, Tailwind", type: "text" },
  { id: 3, name: "Location", label: "location", placeholder: "Remote / New Delhi", type: "text" },
  { id: 4, name: "Open Seats", label: "seats", placeholder: "0", type: "number" },
  { id: 5, name: "Stipend", label: "stipend", placeholder: "0", type: "number" },
  { id: 6, name: "Duration", label: "duration_in_months", placeholder: "Months", type: "number" },
  { id: 7, name: "Description", label: "short_description", placeholder: "Brief summary of the role", type: "text" },
  { id: 8, name: "Description Link", label: "description_link", placeholder: "https://...", type: "url" },
  { id: 9, name: "Posted On", label: "start_date", placeholder: "Select Date", type: "date" },
];

/* =======================
   COMPONENT
======================= */
export default function CreateIntern() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { internid } = useParams();

  /* =======================
     FETCH INTERN (EDIT MODE)
  ======================= */
  useEffect(() => {
    if (internid) getIntern();
  }, [internid]);

  async function getIntern() {
    try {
      setLoading(true);
      const res = await axios.get(
        `https://internship-extension.onrender.com/api/v1/common/getintern/${internid}`,
        { withCredentials: true }
      );
      setFormData(res.data.data);
      console.log(formData);
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  /* =======================
     HANDLERS
  ======================= */
  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [steps[step].label]: e.target.value,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (step < steps.length - 1) handleNext();
    }
  };

  /* =======================
     CREATE INTERN
  ======================= */
  async function create() {
    try {
      await axios.post(
        "https://internship-extension.onrender.com/api/v1/admin/createintern",
        formData,
        { withCredentials: true }
      );
      navigate("/admindashboard/adminallintern");
    } catch (error) {
      console.log(error);
    }
  }

  /* =======================
     EDIT INTERN
  ======================= */
  async function Edit() {
    try {
      await axios.put(
        `https://internship-extension.onrender.com/api/v1/admin/editintern/${internid}`,
        formData,
        { withCredentials: true }
      );
      navigate("/admindashboard/adminallintern");
    } catch (error) {
      console.log(error);
    }
  }

  /* =======================
     FRAMER VARIANTS
  ======================= */
  const variants = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <div className="flex min-h-screen w-full bg-white overflow-hidden font-sans rounded-md shadow-md">
      {/* LEFT SIDEBAR */}
      <div className="hidden md:flex w-1/3 bg-slate-900 flex-col justify-between p-12 text-white">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {internid ? "Edit Internship" : "Publish Internship"}
          </h1>
          <p className="text-slate-300">
            {internid ? "Update internship details." : "Create a new opportunity."}
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-10">
          {steps.map((s, index) => (
            <div
              key={s.id}
              className={`flex items-center gap-4 ${
                index === step ? "opacity-100" : "opacity-40"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                  index === step
                    ? "bg-indigo-500 border-indigo-500"
                    : "border-slate-500"
                }`}
              >
                {index + 1}
              </div>
              <span className="uppercase text-sm">{s.name}</span>
            </div>
          ))}
        </div>

        <div className="text-xs text-slate-400">
          Press <b>Enter ↵</b> to continue
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="flex-1 flex items-center justify-center p-10 bg-slate-50">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-6"
            >
              <label className="text-lg font-bold text-indigo-600 uppercase">
                {step + 1}. {steps[step].name}
              </label>

              <input
                type={steps[step].type}
                placeholder={steps[step].placeholder}
                value={formData[steps[step].label] || ""}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                autoFocus
                className="w-full bg-transparent text-2xl border-b-2 border-slate-300 focus:border-indigo-600 outline-none py-4"
              />
            </motion.div>
          </AnimatePresence>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 mt-16">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 rounded-lg text-slate-600 hover:bg-slate-200"
              >
                Back
              </button>
            )}

            {step < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-slate-900 text-white rounded-lg"
              >
                Continue
              </button>
            ) : internid ? (
              <button
                onClick={Edit}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg"
              >
                Edit Internship
              </button>
            ) : (
              <button
                onClick={create}
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg"
              >
                Publish Internship
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
